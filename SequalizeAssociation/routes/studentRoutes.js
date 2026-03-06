const express = require('express');
const router = express.Router();
const studentController = require('../controller/studentController')


router.post('/add', studentController.addEntries)
router.put('/update/:id', studentController.updateEntry)
router.delete('/delete/:id', studentController.deleteEntry)
router.post('/addingStudentWithCard', studentController.addingValuesToStudentAndIdentityTable);
router.post('/addStudentWithDepartment', studentController.addStudentWithDepartment);

module.exports = router;