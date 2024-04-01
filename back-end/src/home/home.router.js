const express = require('express');
const homeRouter = express.Router();
const {
  fetchHome,
} = require('./home.controller');

homeRouter.route('/').get(fetchHome)

module.exports = homeRouter;