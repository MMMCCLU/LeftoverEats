const express = require('express');
const featuresRouter = express.Router();
const {
  fetchMapFeatures,
  createMapFeature
} = require('./features.controller');

featuresRouter.route('').get(fetchMapFeatures).post(createMapFeature);

module.exports = featuresRouter;