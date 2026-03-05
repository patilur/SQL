const connection = require('../utils/db-connection');
const db = require('../utils/db-connection');
const Student = require('../model/student');


const addEntries = async (req, res) => {
    const { email, name } = req.body;
    try {
        const student = await Student.create({
            email: email,
            name: name
        })
        res.status(201).send(`User with name :${name} is created`)
    } catch (err) {
        res.status(500).send('Unable to make entry');
    }
}

const updateEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const student = await Student.findByPk(id);
        if (!student) {
            res.status(404).send("User is not found");
        }
        student.name = name;
        await student.save();
        res.status(200).send('User has been updated');
    } catch (err) {
        res.status(500).send("User can not be updated");
    }

}

const deleteEntry = async (req, res) => {
    try {
        const { id } = req.params;

        const deletestudent = await Student.destroy({
            where: {
                id: id
            }
        });

        if (!deletestudent) {
            return res.status(404).send('User is not found');
        }

        res.status(200).send('User is deleted');

    } catch (error) {
        console.log(error);
        res.status(500).send('Error encountered while deleting.');
    }
};

module.exports = { addEntries, updateEntry, deleteEntry }
