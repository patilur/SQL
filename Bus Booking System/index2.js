const express = require('express');
const usersRoute = require('./routes/userRoutes')
const busRoute = require('./routes/busRoutes')
const app = express();


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


// 404 Handler (ALWAYS LAST)
app.use((req, res) => {
    res.status(404).send("Page not found");
});


app.get('/', (req, res) => {
    res.send('Hello world')
})

app.listen(3000, (err) => {
    console.log('Server running')
})
