//----------------------------------------------------------------------------------------
/**
 * TODO LIST DATA MODEL                                                                 *
 *                                                                                      *
 * class constructor arguments:                                                         *
 *          server: hapi server instance                                                *
 *                                                                                      */
//----------------------------------------------------------------------------------------

"use strict";

const Joi = require("joi");
const Db = require("../db/memory");

class todoModel {
  constructor(server) {
    server.method("getAll", Db.getAll);
    server.method("put", Db.put);
    server.method("edit", Db.edit);
    server.method("del", Db.del);

    this.getAll = {
      handler: function(request, h) {
        console.log(`${request.method} => ${JSON.stringify(request.info)}`);
        const { filter, orderBy } = request.query;
        return server.methods.getAll(filter, orderBy);
      },
      validate: {
        query: {
          filter: Joi.string()
            .valid(["ALL", "INCOMPLETE", "COMPLETE"])
            .default("ALL"),
          orderBy: Joi.string()
            .valid(["DESCRIPTION", "DATE_ADDED"])
            .default("DATE_ADDED")
        }
      },
      description: "List all to-do items",
      tags: ["api"],
      cors: true
    };

    this.put = {
      handler: function(request, h) {
        console.log(`${request.method} => ${JSON.stringify(request.info)}`);
        return server.methods.put(request.payload.description);
      },
      validate: {
        payload: {
          description: Joi.string().min(1)
        }
      },
      description: "Add an item to the to-do list",
      tags: ["api"],
      cors: true
    };

    this.edit = {
      handler: function(request, h) {
        console.log(`${request.method} => ${JSON.stringify(request.info)}`);
        return server.methods
          .edit(request.params.id, request.payload)
          .then(e => {
            if (e === 404) {
              return h.response().code(404);
            }
            if (e === 400) {
              return h.response().code(400);
            }
            return e;
          });
      },

      validate: {
        params: {
          id: Joi.string()
            .regex(
              /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
            )
            .required()
        },
        payload: Joi.object({
          description: Joi.string().min(1),
          state: Joi.string().valid(["INCOMPLETE", "COMPLETE"])
        }).min(1)
      },
      description: "Edit an item on the to-do list",
      tags: ["api"],
      cors: true
    };

    this.del = {
      handler: function(request, h) {
        console.log(`${request.method} => ${JSON.stringify(request.info)}`);
        return server.methods.del(request.params.id).then(e => {
          if (e === 404) {
            return h.response().code(404);
          }
          return e;
        });
      },

      validate: {
        params: {
          id: Joi.string()
            .regex(
              /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
            )
            .required()
        }
      },
      description: "Delete an item on the to-do list",
      tags: ["api"],
      cors: true
    };
  }
}

module.exports = server => {
  return new todoModel(server);
};
