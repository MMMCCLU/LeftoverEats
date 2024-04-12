const { pool } = require('../db');


const getMapFeaturesFromDb = async () => {
  let connection;
  try {
      connection = await pool.getConnection();
      connection.beginTransaction();

      // Retrieves all information from the "feature" table
      const [results] = await pool.execute(`
          SELECT feature.featureId, feature.featureType, coordinate.coordinateID, coordinate.latitude, coordinate.longitude, feature.createdAt
          FROM feature
          JOIN coordinate on feature.featureId=coordinate.featureId`);

      await connection.commit();

      // Organize the data into the desired format
      const featuresMap = new Map();
      results.forEach((item) => {
          const { featureId, featureType, createdAt, coordinateID, latitude, longitude } = item;

          // Check if featureId exists in the map
          if (!featuresMap.has(featureId)) {
              // If not, create a new feature object
              featuresMap.set(featureId, {
                  featureId,
                  featureType,
                  createdAt,
                  coordinates: [],
              });
          }

          // Add coordinate to the coordinates array of the corresponding feature
          featuresMap.get(featureId).coordinates.push({
              coordinateID,
              latitude,
              longitude,
          });
      });

      // Convert map values to an array of features
      const featuresArray = Array.from(featuresMap.values());

      return featuresArray;
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

// Saves a Map Feature to the database and returns the resulting Feature ID
const saveMapFeatureToDB = async (featureType) => {
  const currentDate = new Date();

  let connection;
  try {
    connection = await pool.getConnection();
    connection.beginTransaction();

    // Insert feature information
    const [result] = await connection.execute(
      'INSERT INTO `feature` (featureType, createdAt) \
      VALUES (?,?)',
      [featureType, currentDate]
    );

    // Return the featureId primary key
    const featureId = result.insertId;  

    await connection.commit();
    return featureId;
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
}

// Creates a coordinate in the database
const saveCoordinateToDB = async (featureId, coordinate) => {
  let connection;
  try {
    connection = await pool.getConnection();
    connection.beginTransaction();

    await connection.execute(
      'INSERT INTO `coordinate` (featureID, latitude, longitude) \
      VALUES (?,?,?)',
      [featureId , coordinate.latitude, coordinate.longitude]
    );

    await connection.commit();
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
}
module.exports = {
    getMapFeaturesFromDb,
    saveMapFeatureToDB,
    saveCoordinateToDB
};