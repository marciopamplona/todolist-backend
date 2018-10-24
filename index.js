//----------------------------------------------------------------------------------------
/**
 *                                 TODO LIST BACKEND API                                *
 *                                                                                      */
//----------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------
/**
 * # Project folders:                                                                   *
 *      - config: config methods and constants                                          *
 *      - db: database interfaces                                                       *
 *      - models: data handling models                                                  *
 *                                                                                      */
//----------------------------------------------------------------------------------------

"use strict";

const Hapi = require("hapi");
const Db = require("./db/memory");
const config = require("./config/config");
console.log(config.banner);

//──── SERVER DECLARATION ────────────────────────────────────────────────────────────────
const server = Hapi.server({
  port: config.serverPort,
  host: config.serverHost
});

const todoModel = require("./models/todo")(server);

//──── SERVER INITIALIZATION ─────────────────────────────────────────────────────────────
const serverInit = async () => {
  await Db.init();
  await server.register([
    require("vision"),
    require("inert"),
    {
      plugin: require("lout"),
      options: {
        apiVersion: "1.0"
      }
    }
  ]);

  server.route({
    method: "GET",
    path: "/",
    options: {
      handler: (request, h) => {
        return h.redirect("/docs");
      }
    }
  });

  server.route({
    method: "GET",
    path: "/todos",
    config: todoModel.getAll
  });

  server.route({
    method: "PUT",
    path: "/todos",
    config: todoModel.put
  });

  server.route({
    method: "PATCH",
    path: "/todo/{id}",
    config: todoModel.edit
  });

  server.route({
    method: "DELETE",
    path: "/todo/{id}",
    config: todoModel.del
  });
  //________________________________________________________________________________________

  await server.start();
  console.log(`INFO: Server running at: ${server.info.uri}`);
};

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

serverInit();
