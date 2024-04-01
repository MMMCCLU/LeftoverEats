const {
    getHomeInfoFromDb
  } = require('./home.service');

  const fetchHome = async (req, res) => {
    try {
      const home = await getHomeInfoFromDb();
      res.status(200).json(home);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Error' });
    }
  };

  module.exports = {
    fetchHome
  };