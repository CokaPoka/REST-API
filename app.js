require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const ingredientsRoutes = require('./api/routes/ingredients');
const saladsRoutes = require('./api/routes/salads');
const usersRoutes = require('./api/routes/users');

const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/ingredients', ingredientsRoutes);
app.use('/salads', saladsRoutes);
app.use('/users', usersRoutes);


mongoose.connect('mongodb+srv://coka:'+process.env.DB_CONNECT+'@cluster0-fjklc.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true

}, err => err ? console.log(err) : console.log('Connected to database'));

module.exports = app;