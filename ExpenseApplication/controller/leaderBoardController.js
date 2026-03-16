const User = require('../model/signupModel');
const Expense = require('../model/expenseModel');
const sequelize = require('../utils/db-connection');

const getLeaderboard = async (req, res) => {

    try {
        if (!req.user.isPremiumUser) {
            return res.status(403).json({
                message: "User is not a premium member"
            });
        }
        //SELECT Users.id,Users.name,COALESCE(SUM(Expenses.expenseamount),0) AS totalExpens FROM Users
        //LEFT JOIN Expenses ON Users.id = Expenses.userId
        //GROUP BY Users.id
        //ORDER BY totalExpense DESC;
        // const leaderboard = await User.findAll({
        //     attributes: [
        //         'id',
        //         'name',
        //         [
        //             sequelize.fn(
        //                 'COALESCE',
        //                 sequelize.fn('SUM', sequelize.col('Expenses.expenseamount')),
        //                 0
        //             ),
        //             'totalExpense'
        //         ]
        //     ],
        //     include: [
        //         {
        //             model: Expense,
        //             attributes: [],
        //             required: false
        //         }
        //     ],
        //     group: ['Users.id'],
        //     order: [[sequelize.literal('totalExpense'), 'DESC']]
        // });
        const leaderboard = await User.findAll({
            attributes: ['id', 'name', 'totalExpense'], // Just pull the column
            order: [['totalExpense', 'DESC']]
        });
        res.status(200).json(leaderboard);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Error fetching leaderboard"
        });
    }
};

module.exports = { getLeaderboard };