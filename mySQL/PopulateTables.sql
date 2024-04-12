use accessMaps;

INSERT into about (teamName, teamLetter, description)
VALUES("Leftover Maps", "I", "Our goal is to allow for easier access to interactive accessibility maps."); 

-- Create elevator 1
INSERT INTO feature (featureID, featureType, createdAt)
VALUES(1, "elevator", "2024-04-06");
INSERT INTO coordinate(featureID, latitude, longitude)
VALUES(1, 34.677309892334335, -82.83709680406795);

-- Create elevator 2
INSERT INTO feature (featureID, featureType, createdAt)
VALUES(3, "elevator", "2024-04-09");
INSERT INTO coordinate(featureID, latitude, longitude)
VALUES(3, 34.675370671011, -82.83695615678076);


-- Creats a stair with 4 points
INSERT INTO feature (featureID, featureType, createdAt)
VALUES(2, "stairs", "2024-04-07");


INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(2, 34.67722082046042, -82.83705584716907);
INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(2, 34.67717339641044, -82.83705886465414);
INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(2, 34.67719710843884, -82.83735591929563);
INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(2, 34.67725378207683, -82.83733711630806);