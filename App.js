const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const cookiesParser = require('cookie-parser');
const ConnectDB = require('./DB/db')
const userRoutes = require('./Route/user.route')
const captainROutes = require('./Route/captain.route')

ConnectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookiesParser());


app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/captain', captainROutes);

app.use('/users', userRoutes);


module.exports = app;
