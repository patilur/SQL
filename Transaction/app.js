// app.js
const express = require('express');
const sequelize = require('./config/database');
const User = require('./model/User');
const transactionRoutes = require('./routes/TransctionRoute');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Use the transaction routes
app.use('/api', transactionRoutes);

// Database connection and Server Start
(async () => {
    try {
        // 1. Test database connection
        await sequelize.authenticate();
        console.log('Database connection successful');

        // 2. Sync models (force: true drops existing tables - use with caution!)
        // In production, you would typically use { force: false } or migrations
        await sequelize.sync({ force: true });
        console.log('Database synchronized with force=true (tables recreated)');

        // 3. Start the server
        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();