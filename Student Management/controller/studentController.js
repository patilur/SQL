const db = require('../utils/db-connection');

const addEntries = (req, res) => {
    const { email, name, age } = req.body;
    const insertQuery = 'Insert into students (email,name,age) values (?,?,?)'

    db.execute(insertQuery, [email, name, age], (err) => {
        if (err) {
            console.log(err.message);

            if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({ message: "Email already exists" });
            }

            return res.status(500).json({ error: err.message });
        }
        console.log("value has been inserted");
        res.status(201).json({
            message: `student with name ${name} successfully added`,
        });
    })
}

const getEntries = (req, res) => {
    const getQuery = 'select * from students'

    db.execute(getQuery, (err, result) => {
        if (err) {
            console.log(err.message)
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({
            message: "Successfully fetched student list",
            data: result
        });
    })
}

const getStudentwithId = (req, res) => {
    const stdid = parseInt(req.params.stdid)
    const getQuery = 'select * from students where id=?';

    db.execute(getQuery, [stdid], (err, result) => {
        if (err) {
            console.log(err.message);
            return res.status(500).json({ error: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json({
            message: "Successfully fetched student",
            data: result[0]
        });
    })
}

const updateEntry = (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const updateQuery = "Update students set name=?,email=? where id=?";

    db.execute(updateQuery, [name, email, id], (err, result) => {
        if (err) {
            console.log(err.message);
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({
            message: "Student updated successfully",
            data: result
        });
    })
}

const deleteEntry = (req, res) => {
    const { id } = req.params;
    const deleteQuery = "Delete from students where id=?";

    db.execute(deleteQuery, [id], (err, result) => {
        if (err) {
            console.log(err.message);
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).send("Student not found");
        }

        res.status(200).json({ message: `Student with id ${id} deleted successfully` });
    })
}

module.exports = { addEntries, getEntries, updateEntry, deleteEntry, getStudentwithId }
