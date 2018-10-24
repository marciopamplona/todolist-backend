'use strict';

const banner = '\n\
─────────────────────────────────────────────────────────────\n\
╔╦╗╔═╗╔╦╗╔═╗  ╦  ╦╔═╗╔╦╗  ┌┐ ┬ ┬  ┌┬┐┌─┐┌─┐┌┬┐┌─┐┬  ┌─┐┌┐┌┌─┐\n\
 ║ ║ ║ ║║║ ║  ║  ║╚═╗ ║   ├┴┐└┬┘  │││├─┘├─┤│││├─┘│  │ ││││├─┤\n\
 ╩ ╚═╝═╩╝╚═╝  ╩═╝╩╚═╝ ╩   └─┘ ┴   ┴ ┴┴  ┴ ┴┴ ┴┴  ┴─┘└─┘┘└┘┴ ┴\n\
─────────────────────────────────────────────────────────────\n';

let DEV = false;
let serverPort;
let serverHost;

process.argv.forEach((val, index) => {
    if (val === 'dev') DEV = true;
});

if (DEV) {
    serverPort = 3000;
    serverHost = 'localhost';
} else {
    serverPort = process.env.PORT || 8080;
    serverHost = '0.0.0.0';
}

module.exports = { serverHost, serverPort, DEV, banner};
