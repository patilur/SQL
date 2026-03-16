const User = require('../model/signupModel');
const Expense = require('../model/expenseModel');
const sequelize = require('../utils/db-connection');

const getLeaderboard = async (req, res) => {

    try {

        const leaderboard = await User.findAll({
            attributes: [
                'id',
                'name',
                [sequelize.fn('SUM', sequelize.col('Expenses.expenseamount')), 'totalExpense']
            ],
            include: [{
                model: Expense,
                attributes: []
            }],
            group: ['Users.id'],
            order: [[sequelize.literal('totalExpense'), 'DESC']]
        });

        res.status(200).json(leaderboard);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fetching leaderboard" });
    }
};

module.exports = { getLeaderboard };