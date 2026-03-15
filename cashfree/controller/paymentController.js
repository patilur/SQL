const path = require('path');
const Order = require('../model/order');
const User = require('../model/user');
const { createOrder } = require('../utils/cashfree');

exports.getPaymentPage = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/index.html"));
};

exports.processPayment = async (req, res) => {
    try {
        const userId = 1; // Demo user
        const amount = 2000;
        const orderId = "ORDER_" + Date.now();

        const paymentSessionId = await createOrder(orderId, amount, userId, "9999999999");

        // Save PENDING order
        await Order.create({ orderId, userId, amount, status: "PENDING" });

        res.json({ paymentSessionId, orderId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create order" });
    }
};

exports.getPaymentStatus = async (req, res) => {
    try {

        const orderId = req.params.orderId;

        const order = await Order.findOne({ where: { orderId } });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const { Cashfree, CFEnvironment } = require("cashfree-pg");

        const cashfree = new Cashfree(
            CFEnvironment.SANDBOX,
            process.env.CASHFREE_APP_ID,
            process.env.CASHFREE_SECRET_KEY
        );

        // IMPORTANT LINE (Sharpner instruction)
        const response = await cashfree.PGOrderFetchPayments(orderId);

        const payment = response.data[0];

        let status = "FAILED";

        if (payment && payment.payment_status === "SUCCESS") {
            status = "SUCCESS";

            await User.update(
                { isPremium: true },
                { where: { id: order.userId } }
            );
        }

        await order.update({ status });

        res.json({ orderStatus: status });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch payment status" });
    }
};