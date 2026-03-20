const User = require('./signupModel');
const Expense = require('./expenseModel');


User.hasMany(Expense, { foreignKey: 'userId' });
Expense.belongsTo(User, { foreignKey: 'userId' });

module.exports = { User, Expense };