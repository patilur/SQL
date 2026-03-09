const express = require('express');
const blogRoute = require('./routes/BlogRoute')
const db = require('./utils/db-connection')
const app = express();
const { Blog, Comment } = require('./model/Index');
const path = require('path');
const cors = require('cors');

// Logging Middleware
app.use((req, res, next) => {
    console.log(`${req.method} request made to ${req.url}`);
    next();
});

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

// Route to show appointment form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
});



app.use('/blogs', blogRoute);


// 404 Handler (ALWAYS LAST)
app.use((req, res) => {
    res.status(404).send("Page not found");
});



db.sync({ force: false }).then(() => {
    app.listen(3000, (err) => {
        console.log('Server running')
    })
}).catch((err) => {
    console.log(err);
})
