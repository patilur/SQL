const jwt = require('jsonwebtoken');
const User = require('../model/signupModel');

const authenticate = async (req, res, next) => {

    try {

        const authHeader = req.header("Authorization");
        const token = authHeader.split(" ")[1];
        console.log(token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findByPk(decoded.userId);

        req.user = user;

        next();

    } catch (err) {

        res.status(401).json({
            message: "Authentication failed"
        });

    }
}

module.exports = {
    authenticate
};