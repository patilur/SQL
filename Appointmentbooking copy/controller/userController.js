const Users = require('../model/userModel');
const db = require('../utils/db-connection');


const addEntries = async (req, res) => {
    const { username, phoneno, email } = req.body;
    console.log(req.body);
    try {
        const user = await Users.create({
            username: username,
            phoneno: phoneno,
            email: email
        });

        res.status(201).json({
            message: "User created successfully",
            data: user
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Unable to make entry"
        });
    }
};

const getEntry = async (req, res) => {
    try {
        const users = await Users.findAll();

        if (users.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Users fetched successfully",
            data: users
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Unable to find users"
        });
    }
};

const updateEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, phoneno, email } = req.body;

        const user = await Users.findByPk(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.username = username;
        user.phoneno = phoneno;
        user.email = email;

        await user.save();

        res.status(200).json({
            message: "User updated successfully",
            data: user
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "User cannot be updated"
        });
    }
};

const deleteEntry = async (req, res) => {
    try {
        const { id } = req.params;

        const deleteuser = await Users.destroy({
            where: {
                id: id
            }
        });

        if (!deleteuser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error encountered while deleting"
        });
    }
};

module.exports = { addEntries, getEntry, updateEntry, deleteEntry };