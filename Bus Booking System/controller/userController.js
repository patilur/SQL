//const connection = require('../utils/db-connection');
const db = require('../utils/db-connection');

const addEntries = (req, res) => {
    const { name, email } = req.body;
    const insertQuery = 'Insert into users (name,email) values (?,?)'

    db.execute(insertQuery, [name, email], (err) => {
        if (err) {
            console.log(err.message)
            res.status(500).send(err.message);
            db.end();
            return;
        }

        console.log("value has been inserted");
        res.status(200).send(`User with name ${name} successfully added`);
    })
}
const getEntry = (req, res) => {
    const getQuery = 'select * from users';

    db.execute(getQuery, (err, result) => {
        if (err) {
            console.log(err.message)
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({
            message: "Successfully fetched user list",
            data: result
        });
    })
}



// const updateEntry = (req, res) => {
//     const { id } = req.params;
//     const { name } = req.body;
//     const updateQuery = "Update students set name=? where id=?";

//     db.execute(updateQuery, [name, id], (err, result) => {
//         if (err) {
//             console.log(err.message);
//             res.status(500).send(err.message);
//             db.end();
//             return;
//         }
//         if (result.affectedRows === 0) {
//             res.status(404).send("Student not found");
//             return;
//         }
//         res.status(200).send("Student updated successfully");
//     })
// }

// const deleteEntry = (req, res) => {
//     const { id } = req.params;
//     const deleteQuery = "Delete from students where id=?";

//     db.execute(deleteQuery, [id], (err, result) => {
//         if (err) {
//             console.log(err.message);
//             res.status(500).send(err.message);
//         }
//         if (result.affectedRows === 0) {
//             res.status(404).send("Student not found");
//             return;
//         }
//         res.status(200).send(`Student with ${id} deleted successfully`);
//     })
// }

module.exports = { addEntries, getEntry }
