const jwt = require('jsonwebtoken');
const User = require('../model/signupModel');

const authenticate = (req, res, next) => {

    try {

        const token = req.header('Authorization');
        console.log(token);

        const user = jwt.verify(token, '4345464565dfgddfd');
        console.log("<<<", user.userId);

        User.findByPk(user.userId).then(user => {

            console.log(JSON.stringify(user));

            req.user = user;
            next();

        })

    } catch (err) {

        console.log(err);
        return res.status(401).json({ success: false });

    }
}

module.exports = {
    authenticate
};