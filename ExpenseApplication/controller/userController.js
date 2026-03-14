const Users = require('../model/signupModel');
const db = require('../utils/db-connection');


const addEntries = async (req, res) => {
    const { name, email, password } = req.body;
    console.log(req.body);
    try {
        const user = await Users.create({
            name, email, password
        });

        res.status(201).json({
            message: "User created successfully",
            data: user
        });

    } catch (err) {
        console.log(err);
        if (err.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({
                message: "Email already exists"
            });
        }
        res.status(500).json({
            message: "Unable to make entry"
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Users.findOne({
            where: {
                email: email
            }
        });

        // if user not found
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        // check password
        if (user.password !== password) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }
        res.status(201).json({
            message: "User Login successfully",
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