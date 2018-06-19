// src/server.js
const path = require('path');
const bodyParser = require('body-parser');
// Load mongoose package
const mongoose = require('mongoose');

const express = require('express');
const config = require('./config');
const router = require('./routes');

// Connect to MongoDB and create/use database as configured
mongoose.connection.openUri(`mongodb://${config.db.username}:${config.db.password}@${config.db.host}/${config.db.dbName}`);

const app = express();
const publicPath = path.resolve(__dirname, '../public');
app.use(bodyParser.json());
app.use(express.static(publicPath));
app.use('/api', router);

app.listen(config.port, function() {
  console.log(`${config.appName} is listening on port ${config.port}`);
});