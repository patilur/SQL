const Users = require('../model/signupModel');
const db = require('../utils/db-connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();


const generateAccessToken = (id) => {
    return jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: "1h" });
}
const addEntries = async (req, res) => {
    const { name, email, password } = req.body;
    console.log(req.body);
    try {
        bcrypt.hash(password, 8, async (err, hash) => {
            if (err) {
                return res.status(500).json({
                    message: "Error while hashing password"
                });
            }
            try {
                const user = await Users.create({
                    name,
                    email,
                    password: hash
                });
                res.status(201).json({
                    message: "User created successfully",
                    data: user
                });

            } catch (err) {
                if (err.name === "SequelizeUniqueConstraintError") {
                    return res.status(400).json({
                        message: "Email already exists"
                    });
                }
                res.status(500).json({
                    message: "Unable to create user"
                });
            }

        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Something went wrong"
        });

    }
};
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Users.findOne({
            where: { email }
        });

        // user not found
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }
        res.status(200).json({
            message: "User login successfully",
            token: generateAccessToken(user.id),
            data: user
        });

    } catch (err) {
        res.status(500).json({
            message: "Something went wrong",
            error: err.message
        });
    }
}

module.exports = { addEntries, login }