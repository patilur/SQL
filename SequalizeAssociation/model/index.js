const Student = require('./student');
const IdentityCard = require('./identityCard');
const Department = require('./department');

Student.hasOne(IdentityCard, { foreignKey: 'studentId' });
IdentityCard.belongsTo(Student, { foreignKey: 'studentId' });

// Department.hasMany(Student);
// Student.belongsTo(Department);

Department.hasMany(Student, { foreignKey: 'departmentId' });
Student.belongsTo(Department, { foreignKey: 'departmentId' });

module.exports = {
    Student, IdentityCard, Department
}