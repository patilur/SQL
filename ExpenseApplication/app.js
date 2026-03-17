const express = require('express');
const db = require('./utils/db-connection')
const app = express();
const path = require('path');
const cors = require('cors');
const userRoute = require('./routes/userRoutes')
const expenseroute = require('./routes/expenseRoute');
const { User, Expense } = require('./model/index');
const premiumRoutes = require('./routes/premium');
const paymentRoutes = require('./routes/paymentRoute');
const genAIRoute = require('./routes/genAIRoute');
const dotenv = require("dotenv");
dotenv.config();
// Logging Middleware
app.use((req, res, next) => {
    console.log(`${req.method} request made to ${req.url}`);
    next();
});

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

// Signup Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'signup.html'));
});

// Signin Page
app.get('/signin', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'signin.html'));
});

//home page
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'home.html'));
});



// Routes
app.use('/', paymentRoutes);
app.use('/premium', premiumRoutes);
app.use('/user', userRoute);
app.use('/expense', expenseroute)
app.use('/ask', genAIRoute);

// 404 Handler (ALWAYS LAST)
app.use((req, res) => {
    res.status(404).send("Page not found");
});

db.sync({ force: false }).then(() => {
    app.listen(3000, (err) => {
        console.log('Server running')
        console.log("Loaded Key:", process.env.GEMINI_API_KEY ? "Exists" : "Missing");
    })
}).catch((err) => {
    console.log(err);
})
