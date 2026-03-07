const express = require('express');
const path = require('path'); // ✅ import path
const expenseRoute = require('./routes/expenseRoute');
const db = require('./utils/db-connection');
const expenseModel = require('./model/expenseModel');

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
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

// User routes
app.use('/expense', expenseRoute);

// 404 Handler (ALWAYS LAST)
app.use((req, res) => {
    res.status(404).send("Page not found");
});

db.sync({ force: true }).then(() => {
    app.listen(3000, () => {
        console.log('Server running');
    });
}).catch((err) => {
    console.log(err);
});