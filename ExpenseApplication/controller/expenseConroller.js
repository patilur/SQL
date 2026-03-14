const Expense = require('../model/expenseModel');
const db = require('../utils/db-connection');


const addExpense = async (req, res) => {
    const { expenseamount, description, category } = req.body;
    console.log(req.body);
    try {
        const expense = await Expense.create({
            expenseamount: expenseamount,
            description: description,
            category: category
        });

        res.status(201).json({
            message: "Expense created successfully",
            data: expense
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Unable to make entry"
        });
    }
}

const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;

        const deleteexpense = await Expense.destroy({
            where: {
                id: id
            }
        });

        if (!deleteexpense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.status(200).json({
            message: "Expense deleted successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error encountered while deleting"
        });
    }
}

const getExpense = async (req, res) => {
    try {
        const expenses = await Expense.findAll();

        res.status(200).json({
            message: "Expenses fetched successfully",
            data: expenses
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Unable to find expense"
        });
    }
}

const editExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { expenseamount, description, category } = req.body;

        const expense = await Expense.findByPk(id);

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        expense.expenseamount = expenseamount;
        expense.description = description;
        expense.category = category;

        await expense.save();

        res.status(200).json({
            message: "Expense updated successfully",
            data: expense
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Expense cannot be updated"
        });
    }
}

module.exports = { addExpense, deleteExpense, getExpense, editExpense }