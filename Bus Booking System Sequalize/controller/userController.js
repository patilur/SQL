//const connection = require('../utils/db-connection');
const db = require('../utils/db-connection');
const User = require('../model/userModel');

const addEntries = async (req, res) => {
    const { name, email } = req.body;
    //const { email, name } = req.body;
    try {
        const user = await User.create({
            name: name,
            email: email
        })
        res.status(201).send(`User with name :${name} is created`)
    } catch (err) {
        res.status(500).send('Unable to make entry');
    }
}
const getEntry = async (req, res) => {
    try {
        const users = await User.findAll();
        if (users.length === 0) {
            return res.status(404).send("User is not found");
        }

        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).send('Unable to find users');
    }
}


module.exports = { addEntries, getEntry }
