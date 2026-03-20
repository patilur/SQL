const User = require('../model/User');
const sequelize = require('../config/database');

const transferFunds = async (req, res) => {
    // 1. Start the transaction
    const transaction = await sequelize.transaction();

    try {
        const { senderId, receiverId, amount } = req.body;

        // 2. Fetch both users within the transaction
        const sender = await User.findByPk(senderId, { transaction });
        const receiver = await User.findByPk(receiverId, { transaction });

        if (!sender || !receiver) {
            throw new Error('User not found');
        }

        if (sender.balance < amount) {
            throw new Error('Insufficient balance');
        }

        // 3. Perform the balance updates
        sender.balance -= amount;
        await sender.save({ transaction });

        // Optional: Simulation of a crash/error to test rollback
       // if (Math.random() > 0.5) { throw new Error('Simulated System Crash'); }

        receiver.balance += amount;
        await receiver.save({ transaction });

        // 4. Commit if everything succeeded
        await transaction.commit();
        console.log('Transaction Successful!');

        res.status(200).json({
            success: true,
            message: "Transaction is successful"
        });

    } catch (error) {
        // 5. Rollback if any error occurs
        if (transaction) await transaction.rollback();

        console.error('Transaction Failed:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const createUser = async (req, res) => {
    try {
        const { name, balance } = req.body;
        const user = await User.create({ name, balance });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { transferFunds, createUser };