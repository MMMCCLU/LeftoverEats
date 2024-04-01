const express = require('express');
const featuresRouter = express.Router();
const {
  fetchMapFeatures,
} = require('./features.controller');

featuresRouter.route('/:id').get(fetchMapFeatures)

module.exports = featuresRouter;