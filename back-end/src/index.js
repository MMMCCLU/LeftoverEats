require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'local'}` });
const express = require('express');
const app = express();
const cors = require('cors');



// ROUTERS
const featuresRouter = require('./features/features.router');
const homeRouter = require('./home/home.router');


const { pool } = require('./db');



const whitelist = ['http://localhost:3000'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});


// Simple test request
app.get('/test', (req, res) => {
    res.send('Hello, test!');
});


// ---- ROUTES ----
app.use('/', homeRouter);
app.use('/features', featuresRouter);