const {
    getFeaturesFromDb
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

  module.exports = {
    fetchMapFeatures
  };