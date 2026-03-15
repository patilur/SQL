const express = require('express');
const path = require('path');
const paymentRoutes = require('./routes/paymentRoute');
const sequelize = require('./utils/db-connection');

const app = express();
app.use(express.json());

app.use("/", paymentRoutes);

sequelize.sync({ alter: true }).then(() => {
    app.listen(process.env.PORT || 3000, () => console.log("Server running on port 3000"));
});

