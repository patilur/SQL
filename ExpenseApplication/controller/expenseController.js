const Expense = require('../model/expenseModel');
const db = require('../utils/db-connection');


const addExpense = async (req, res) => {
    const { expenseamount, description, category, type } = req.body;
    const t = await db.transaction();

    try {
        if (!expenseamount || !category) {
            await t.rollback();
            return res.status(400).json({ message: "Amount and category required" });
        }
        if (isNaN(expenseamount) || Number(expenseamount) <= 0) {
            await t.rollback();
            return res.status(400).json({ message: "Invalid amount" });
        }

        if (!["income", "expense"].includes(type)) {
            await t.rollback();
            return res.status(400).json({ message: "Invalid type" });
        }

        const expense = await Expense.create({
            expenseamount,
            description,
            category,
            userId: req.user.id,
            type
        }, { transaction: t });

        let totalExpense = Number(req.user.totalExpense);

        if (type === "expense") {
            totalExpense += Number(expenseamount);
        }

        await req.user.update({ totalExpense }, { transaction: t });

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
};

const deleteExpense = async (req, res) => {
    const t = await db.transaction();

    try {
        const { id } = req.params;

        const expense = await Expense.findOne({
            where: {
                id: id,
                userId: req.user.id
            },
            transaction: t
        });

        if (!expense) {
            await t.rollback();
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        const amount = Number(expense.expenseamount);
        const type = expense.type;

        // ✅ DELETE EXPENSE
        await expense.destroy({
            where: {
                id: id,
                userId: req.user.id
            },
            transaction: t
        });

        // ✅ UPDATE totalExpense ONLY IF TYPE = expense
        let totalExpense = Number(req.user.totalExpense);

        if (type === "expense") {
            totalExpense -= amount;
        }

        await req.user.update(
            { totalExpense },
            { transaction: t }
        );

        await t.commit();

        res.status(200).json({
            message: "Expense deleted successfully"
        });

    } catch (error) {
        console.log(error);
        await t.rollback();

        res.status(500).json({
            message: "Error encountered while deleting"
        });
    }
};

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
        const { expenseamount, description, category, type } = req.body;

        if (!["income", "expense"].includes(type)) {
            await t.rollback();
            return res.status(400).json({ message: "Invalid type" });
        }
        if (isNaN(expenseamount) || Number(expenseamount) <= 0) {
            await t.rollback();
            return res.status(400).json({ message: "Invalid amount" });
        }
        const expense = await Expense.findOne({
            where: {
                id: id,
                userId: req.user.id
            },
            transaction: t
        });

        if (!expense) {
            await t.rollback();
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        const oldAmount = Number(expense.expenseamount);
        const oldType = expense.type;

        const newAmount = Number(expenseamount);
        const newType = type;

        // update expense
        expense.expenseamount = newAmount;
        expense.description = description;
        expense.category = category;
        expense.type = newType;

        await expense.save({ transaction: t });

        let totalExpense = Number(req.user.totalExpense);

        // 🧠 HANDLE ALL CASES

        if (oldType === "expense" && newType === "expense") {
            // just difference
            totalExpense = totalExpense - oldAmount + newAmount;
        }

        else if (oldType === "income" && newType === "income") {
            // no change in totalExpense
        }

        else if (oldType === "expense" && newType === "income") {
            // remove expense
            totalExpense = totalExpense - oldAmount;
        }

        else if (oldType === "income" && newType === "expense") {
            // add new expense
            totalExpense = totalExpense + newAmount;
        }

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
};

module.exports = { addExpense, deleteExpense, getExpense, editExpense }