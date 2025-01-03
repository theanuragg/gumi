const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const ConnectDB = require('./DB/db')
const userRoutes = require('./Route/user.route')

ConnectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/users', userRoutes);


module.exports = app;
