const User = require('./signupModel');
const Expense = require('./expenseModel');
const Payment = require('./paymentModel');
const ForgotPassword = require('./forgotPassword');

User.hasMany(Expense, { foreignKey: 'userId' });
Expense.belongsTo(User, { foreignKey: 'userId' });



User.hasMany(Payment, { foreignKey: 'userId' });
Payment.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(ForgotPassword, { foreignKey: 'userId' });
ForgotPassword.belongsTo(User, { foreignKey: 'userId' });

module.exports = { User, Expense,Payment,ForgotPassword };