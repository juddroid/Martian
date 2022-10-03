const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

const indexRouter = require('./routes/index');
const receiveRouter = require('./routes/receiver');

app.use('/', indexRouter);
app.use('/receiver', receiveRouter);

module.exports = app;
