const { pool } = require('../db');


const getHomeInfoFromDb = async () => {
    let connection;
    try {
      connection = await pool.getConnection();
      connection.beginTransaction();
  
      // Retrieves all information from the "about" table
      const [results] = await pool.execute('SELECT * FROM about;');

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
    getHomeInfoFromDb
};