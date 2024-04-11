const {
    getMapFeaturesFromDb,
    saveMapFeatureToDB,
    saveCoordinateToDB
  } = require('./features.service');

  const fetchMapFeatures = async (req, res) => {
    try {
      console.log("Received a call for features");
      const features = await getMapFeaturesFromDb(req.query);
      res.status(200).json(features);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Error' });
    }
  };

  const createMapFeature = async (req, res) => {
    try {
      // Extract body information
      const {
        featureType,
        coordinates
      } = req.body;

      // Save the map feature and get the resulting feature ID
      const featureId = await saveMapFeatureToDB(featureType);

      // Save all of the corresponding feature coordiantes
      await Promise.all(coordinates.map(async (coordinate) => {
        await saveCoordinateToDB(featureId, coordinate)
      }));

      res.status(200).json({ message: 'success' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Error' });
    }
  }

  module.exports = {
    fetchMapFeatures,
    createMapFeature
  };