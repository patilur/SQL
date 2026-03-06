const Student = require('./student');
const IdentityCard = require('./identityCard');
const Department = require('./department');
const courses=require('./course');
const studentCourses=require('./studentCourses');

//ont ot one
Student.hasOne(IdentityCard, { foreignKey: 'studentId' });
IdentityCard.belongsTo(Student, { foreignKey: 'studentId' });

//ont to many
// Department.hasMany(Student);
// Student.belongsTo(Department);

Department.hasMany(Student, { foreignKey: 'departmentId' });
Student.belongsTo(Department, { foreignKey: 'departmentId' });

//many to many
Student.belongsToMany(courses,{through:studentCourses})
courses.belongsToMany(Student,{through:studentCourses})

module.exports = {
    Student, IdentityCard, Department,courses,studentCourses
}