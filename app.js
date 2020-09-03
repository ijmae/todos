"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: __dirname + '/.env' });
const app = express();
const port = process.env.PORT || 3000;
const mainController = require('./controllers/ctrlMain');
app.use('/assets', express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.send('OK !');
});
app.listen(port);
console.log('Server is listening on ' + port);
