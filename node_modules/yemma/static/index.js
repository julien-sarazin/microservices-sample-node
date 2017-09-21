const express = require('express');
const path = require('path');

module.exports = app => app.server.use('/', express.static(path.join(__dirname, './dist')));

