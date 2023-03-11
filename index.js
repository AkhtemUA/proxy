const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");
var cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

//=========================================
const originBlacklist = []; // parseEnvList(process.env.CORSANYWHERE_BLACKLIST);
const originWhitelist = []; // parseEnvList(process.env.CORSANYWHERE_WHITELIST);
const cors_proxy = require("cors-anywhere").createServer({
  originBlacklist: originBlacklist,
  originWhitelist: originWhitelist,
  requireHeader: [], // ['origin'],
  removeHeaders: [] /*[
    'cookie',
    'cookie2',
    'x-heroku-queue-wait-time',
    'x-heroku-queue-depth',
    'x-heroku-dynos-in-use',
    'x-request-start'
  ]*/,
  redirectSameOrigin: true,
  httpProxyOptions: {
    xfwd: true,
  },
});
//====================================
app.use(cors());
app.use(cookieParser());
const httpServer = http.createServer(app);
app.use(express.static(__dirname + "/public"));

app.use("/proxy", function (req, res) {
  req.url = req.url.replace("/proxy/", "/"); // Strip "/proxy" from the front of the URL.
  cors_proxy.emit("request", req, res);
});

// Change the 404 message modifing the middleware
app.use(function (req, res, next) {
  res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
});
var PORT = process.env.PORT || 80;
// Start the Proxy

httpServer.listen(PORT, () => {
  console.log(`Starting Proxy at ${PORT}`);
});
