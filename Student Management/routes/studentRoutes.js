const express = require('express');
const router = express.Router();
const studentController = require('../controller/studentController')

/*
POST /students → Insert a new student.
GET /students → Retrieve all students.
GET /students/:id → Retrieve a student by ID.
PUT /students/:id → Update student details.
DELETE /students/:id → Delete a student by ID.
*/
router.post('/add', studentController.addEntries)
router.get('/getAll', studentController.getEntries);
router.get('/get/:stdid', studentController.getStudentwithId);
router.put('/update/:id', studentController.updateEntry)
router.delete('/delete/:id', studentController.deleteEntry)




module.exports = router;