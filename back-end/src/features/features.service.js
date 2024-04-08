const { pool } = require('../db');


const getMapFeaturesFromDb = async () => {
    let connection;
    try {
      connection = await pool.getConnection();
      connection.beginTransaction();
  
      // Retrieves all information from the "feature" table
      const [results] = await pool.execute('SELECT * FROM feature;');
      await connection.commit();

      return results;
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
};

module.exports = {
    getMapFeaturesFromDb
};