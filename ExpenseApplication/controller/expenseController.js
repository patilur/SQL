const Expense = require('../model/expenseModel');
const db = require('../utils/db-connection');


const addExpense = async (req, res) => {
    const { expenseamount, description, category } = req.body;
    const t = await db.transaction();
    console.log(req.body);
    if (!expenseamount || !category) {
        await t.rollback();
        return res.status(400).json({ message: "Amount and category required" });
    }
    try {
        const expense = await Expense.create({
            expenseamount: expenseamount,
            description: description,
            category: category,
            userId: req.user.id
        }, { transaction: t });

        // Update the totalExpense column in the Users table
        const totalExpense = Number(req.user.totalExpense) + Number(expenseamount);
        await req.user.update({ totalExpense: totalExpense }, { transaction: t });

        await t.commit();

        res.status(201).json({
            message: "Expense created successfully",
            data: expense
        });

    } catch (err) {
        console.log(err);
        await t.rollback();
        res.status(500).json({
            message: "Unable to make entry"
        });
    }
}

const deleteExpense = async (req, res) => {
    const t = await db.transaction();
    try {
        const { id } = req.params;
        const expense = await Expense.findOne({
            where: {
                id: id,
                userId: req.user.id
            }, transaction: t
        });
        if (!expense) {
            await t.rollback();
            return res.status(404).json({
                message: "Expense not found"
            });
        }
        const amount = expense.expenseamount;

        await Expense.destroy({
            where: {
                id: id,
                userId: req.user.id
            }
        }, { transaction: t });

        // update totalExpense
        const totalExpense = Number(req.user.totalExpense) - Number(amount);

        await req.user.update(
            { totalExpense },
            { transaction: t }
        );

        await t.commit();

        res.status(200).json({
            message: "Expense deleted successfully"
        });

    } catch (error) {
        await t.rollback();
        res.status(500).json({
            message: "Error encountered while deleting"
        });
    }
}

const getExpense = async (req, res) => {
    try {
        const expenses = await Expense.findAll({
            where: {
                userId: req.user.id
            }
        });

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
    const t = await db.transaction();
    try {
        const { id } = req.params;
        const { expenseamount, description, category } = req.body;

        const expense = await Expense.findOne({
            where: {
                id: id,
                userId: req.user.id
            }, transaction: t
        });

        if (!expense) {
            await t.rollback();
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        const oldAmount = expense.expenseamount;

        expense.expenseamount = expenseamount;
        expense.description = description;
        expense.category = category;

        await expense.save({ transaction: t });

        // adjust totalExpense
        const totalExpense =
            Number(req.user.totalExpense) - Number(oldAmount) + Number(expenseamount);

        await req.user.update(
            { totalExpense },
            { transaction: t }
        );

        await t.commit();

        res.status(200).json({
            message: "Expense updated successfully",
            data: expense
        });
    } catch (err) {
        console.log(err);
        await t.rollback();
        res.status(500).json({
            message: "Expense cannot be updated"
        });
    }
}

module.exports = { addExpense, deleteExpense, getExpense, editExpense }