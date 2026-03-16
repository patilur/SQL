const express = require('express');
const sequelize = require('./utils/db-connection');
const paymentRoutes = require('./routes/paymentRoute');
const cors = require('cors');
const path = require('path');
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', paymentRoutes);

// Start server
sequelize.sync()
    .then(() => {
        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });
    })
    .catch(err => console.log(err));