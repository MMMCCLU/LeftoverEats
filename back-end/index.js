const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('../access-maps/build'));
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.get('/test', (req, res) => {
    res.send('Hello, test!');
});