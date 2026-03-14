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

module.exports = { addEntries }