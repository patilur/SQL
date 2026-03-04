const express = require('express');
const db = require('./utils/db-connection')
const app = express();
const studentRoutes = require('./routes/studentRoutes')

// Logging Middleware
app.use((req, res, next) => {
    console.log(`${req.method} request made to ${req.url}`);
    next();
});

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.use('/students', studentRoutes);


// 404 Handler (ALWAYS LAST)
app.use((req, res) => {
    res.status(404).send("Page not found");
});

app.listen(3000, (err) => {
    console.log('Server running')
})