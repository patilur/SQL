const express = require('express');
const path = require('path');
const usersRoute = require('./routes/userRoutes');
const db = require('./utils/db-connection');
const userModel = require('./model/userModel');

const app = express();
const cors = require('cors')
// Logging Middleware
app.use((req, res, next) => {
    console.log(`${req.method} request made to ${req.url}`);
    next();
});

app.use(express.json());
app.use(cors());
// Serve static files (JS, CSS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Route to show appointment form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'appointment.html'));
});

// User routes
app.use('/users', usersRoute);

// 404 Handler (ALWAYS LAST)
app.use((req, res) => {
    res.status(404).send("Page not found");
});

db.sync({ force: false }).then(() => {
    app.listen(3000, () => {
        console.log('Server running');
    });
}).catch((err) => {
    console.log(err);
});