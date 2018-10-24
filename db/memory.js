//----------------------------------------------------------------------------------------
/*                                                                                      *
 * VOLATILE MEMORY DATABASE                                                             *
 *                                                                                      */
//----------------------------------------------------------------------------------------

'use strict';

const Catbox = require('catbox');
const Memory = require('catbox-memory');
const Uuid = require('uuid/v4');

const memoryDb = new Catbox.Client(Memory, {partition: "todoDatabase"});

const init = async () => {
    await memoryDb.start();
    console.log('INFO: DB started')
}

//──── Get all ids stored in the database ────────────────────────────────────────────────
const getIds = async function (){
    const ids = await memoryDb.get({segment: 'ALL', id:'ids'});
    let result = [];
    if (ids) result = ids.item;
    return result;
}

//──── Get all stored todos ──────────────────────────────────────────────────────────────
const getAll = async function (filter, orderBy){
    const ids = await getIds();
    let result = [];

    for (let i in ids){
        const item = await get(ids[i]);
        switch(filter){
            case 'ALL':{
                result.push(item);
                break;
            }
            case 'COMPLETE':{
                if (item.state === 'COMPLETE') result.push(item);
                break;
            }
            case 'INCOMPLETE':{
                if (item.state === 'INCOMPLETE') result.push(item);
                break;
            }
        }
    }

    if (result.length) {
        switch(orderBy){
            case 'DESCRIPTION':{
                result.sort((a, b) => { 
                    if (a.description < b.description) {return -1} else { return 1 }
                });
                break;
            }
            case 'DATE_ADDED':{
                result.sort((a, b) => { 
                    if (a.dateAdded > b.dateAdded) {return -1} else { return 1 }
                });
                break;
            }
        }
    }

    return result;
}

//──── Get a single todo item ────────────────────────────────────────────────────────────
const get = async function (id) {
    const m = await memoryDb.get({segment: 'ALL', id});
    if (m !== null) { return m.item } else { return null };
}

//──── Store a single todo item ──────────────────────────────────────────────────────────
const put = async function (description) {
    let storedIds = await getIds();
    const id = Uuid();
    const dateAdded = Date.now();
    const state = 'INCOMPLETE';
    storedIds.push(id);

    const item = {
        id,
        state,
        description,
        dateAdded
    }

    await memoryDb.set({segment: 'ALL', id:'ids'}, storedIds);
    await memoryDb.set({segment: 'ALL', id}, item);
    
    return item;
}

//──── Edit a single todo item ───────────────────────────────────────────────────────────
const edit = async function (id, fields) {
    const item = await get(id);

    if (item === null) return 404;
    if (item.state === 'COMPLETE') return 400;

    let state;
    let description;
    const dateAdded = item.dateAdded;

    if (fields.hasOwnProperty('state')) {
        state = fields.state;
    } else {
        state = item.state;
    }

    if (fields.hasOwnProperty('description')) {
        description = fields.description;
    } else {
        description = item.description;
    }

    const editedItem = {
        id,
        state,
        description,
        dateAdded
    }

    await memoryDb.set({segment: 'ALL', id}, editedItem);
    
    return editedItem;
}

//──── Delete a todo item ────────────────────────────────────────────────────────────────
const del = async function (id) {
    const item = await get(id);

    if (item === null) return 404;

    let storedIds = await getIds();
    const idx = storedIds.indexOf(id);
    storedIds.splice(idx,1);

    await memoryDb.set({segment: 'ALL', id:'ids'}, storedIds);
    await memoryDb.drop({segment: 'ALL', id});
    
    return null;
}

module.exports = {init, getAll, put, edit, del};
