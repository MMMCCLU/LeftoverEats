use accessMaps;

INSERT into about (teamName, teamLetter, description)
VALUES("Leftover Maps", "I", "Our goal is to allow for easier access to interactive accessibility maps."); 

-- Create elevator 1
INSERT INTO feature (featureID, featureType, createdAt)
VALUES(1, "elevator", "2024-04-06");
INSERT INTO coordinate(featureID, latitude, longitude)
VALUES(1, 34.677309892334335, -82.83709680406795);

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

-- Create elevator 2
INSERT INTO feature (featureID, featureType, createdAt)
VALUES(3, "elevator", "2024-04-09");
INSERT INTO coordinate(featureID, latitude, longitude)
VALUES(3, 34.675370671011, -82.83695615678076);


-- FIKE Stairs --
INSERT INTO feature (featureID, featureType, createdAt)
VALUES(4, "stairs", "2024-04-13");
INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(4, 34.681255029799516, -82.84200083905513);
INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(4, 34.68125334260014, -82.84203777018632);
INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(4, 34.68124940580143, -82.842072649588);
INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(4, 34.681252217800534, -82.84214309230123);
INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(4, 34.68125053060108, -82.84221148328491);
INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(4, 34.68121003780406, -82.8421629256865);
INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(4, 34.68121509940475, -82.84202887935845);
INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(4, 34.68123084660499, -82.8420131494322);
INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(4, 34.681255029799516, -82.84200083905513);


-- Strom Thurmond Stairs --
INSERT INTO feature (featureID, featureType, createdAt)
VALUES(5, "stairs", "2024-04-20");
INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(5, 34.6751045197404, -82.83666510264628);
INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(5, 34.67517435786106, -82.8366748078827);
INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(5, 34.675234219060464, -82.83672212091021);
INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(5, 34.67529408021662, -82.83685071529268);
INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(5, 34.675304057071756, -82.83693563611129);
INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(5, 34.675275124188495, -82.83706786995742);
INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(5, 34.67523621443302, -82.83712852768501);
INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(5, 34.67519630697252, -82.83699144122066);
INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(5, 34.6751045197404, -82.83666510264628);

-- Library Ramp --
INSERT INTO feature (featureID, featureType, createdAt)
VALUES(6, "ramp", "2024-04-23");
INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(6, 34.6770672108855, -82.83575341800402);
INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(6, 34.67715590370907, -82.83575341800402);
INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(6, 34.677162555667, -82.83578038052275);
INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(6, 34.677070167314476, -82.8357830767746);

-- Business Building --
INSERT INTO feature (featureID, featureType, createdAt)
VALUES(7, "stairs", "2024-04-24");
INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(7, 34.680096607217024, -82.83430635461069);
INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(7, 34.680173170881865, -82.83431100983427);
INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(7, 34.680165514518585, -82.83465898779595);
INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(7, 34.68017891315387, -82.83494993926894);
INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(7, 34.68006598173124, -82.8349988191164);
INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(7, 34.68000281663109, -82.83490222322736);
INSERT INTO coordinate (featureID, latitude, longitude)
VALUES(7, 34.680096607217024, -82.83430635461069);

