const express = require('express');
const usersRoute = require('./routes/userRoutes')
const db = require('./utils/db-connection')
const busRoute = require('./routes/busRoutes')
const app = express();
const userModel = require('./model/userModel')
const busModel = require('./model/busModel')
const bookingRoute = require('./routes/bookingRoute');

// Logging Middleware
app.use((req, res, next) => {
    console.log(`${req.method} request made to ${req.url}`);
    next();
});

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.use('/users', usersRoute);
app.use('/bus', busRoute);
app.use('/booking', bookingRoute);

// 404 Handler (ALWAYS LAST)
app.use((req, res) => {
    res.status(404).send("Page not found");
});


app.get('/', (req, res) => {
    res.send('Hello world')
})

db.sync({ force: true }).then(() => {
    app.listen(3000, (err) => {
        console.log('Server running')
    })
}).catch((err) => {
    console.log(err);
})
