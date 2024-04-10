use accessMaps;

CREATE TABLE IF NOT EXISTS about(
	entryId INTEGER AUTO_INCREMENT PRIMARY KEY,
    teamName VARCHAR(50),
    teamLetter CHAR(1),
    description VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS feature(
	featureID INT AUTO_INCREMENT PRIMARY KEY,
    featureType VARCHAR(50) NOT NULL,
    createdAt DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS coordinate(
    coordinateID INT PRIMARY KEY AUTO_INCREMENT,
	featureID INT NOT NULL,
    latitude FLOAT(30) NOT NULL,
    longitude FLOAT(30) NOT NULL,
    FOREIGN KEY (featureID) REFERENCES feature(featureID)
);