use accessMaps;

CREATE TABLE IF NOT EXISTS about(
	entryId INTEGER AUTO_INCREMENT PRIMARY KEY,
    teamName VARCHAR(50),
    teamLetter CHAR(1),
    description VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS feature(
	featureID INT NOT NULL,
    featureType VARCHAR(50),
    latitude FLOAT(30) NOT NULL,
    longitude FLOAT(30) NOT NULL,
    PRIMARY KEY(featureID, latitude, longitude)
);