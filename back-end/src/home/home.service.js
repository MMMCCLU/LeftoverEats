const { pool } = require('../db');


const getHomeInfoFromDb = async () => {
    // let connection;
    // try {
    //   connection = await pool.getConnection();
    //   connection.beginTransaction();
  
    //   // Retrieves all information from the "about" table
    //   const [rows, fields] = await pool.execute('SELECT * FROM about;');
    //   res.json({
    //     about: rows,
    //   });
    // } catch (error) {
    //   if (connection) {
    //     await connection.rollback();
    //   }
    //   throw error;
    // } finally {
    //   if (connection) {
    //     connection.release();
    //   }
    // }

    return {
      home: {
        "teamName": "Leftover Maps",
        "teamLetter": "I",
        "description": "Our goal is to allow for easier access to interactive accessibility maps."
      }
    };
  };

module.exports = {
    getHomeInfoFromDb
};