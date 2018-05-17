// src/server.js
const path = require('path');

const express = require('express');
const config = require('./config');
const router = require('./routes');

const app = express();
const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));
app.use('/api', router);

app.use(function(req, res, next) {
  res.end("Hello World!");
});

app.listen(config.port, function() {
  console.log(`${config.appName} is listening on port ${config.port}`);
});
