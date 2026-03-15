const express = require('express');
const sequelize = require('./utils/db-connection');
const paymentRoutes = require('./routes/paymentRoute');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('views'));

app.use('/', paymentRoutes);

sequelize.sync()
    .then(() => {
        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });
    })
    .catch(err => console.log(err));