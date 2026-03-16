const path = require("path");

const {
    createOrder,
    getPaymentStatus
} = require("../services/cashfreeService");

const Payment = require("../model/paymentModel");


exports.getPaymentPage = (req, res) => {
    res.sendFile(path.join(__dirname, "../views/index.html"));
};


exports.processPayment = async (req, res) => {

    const orderId = "ORDER-" + Date.now();
    const orderAmount = 2000;
    const orderCurrency = "INR";
    const customerID = "1";
    const customerPhone = "9999999999";

    try {

        const paymentSessionId = await createOrder(
            orderId,
            orderAmount,
            orderCurrency,
            customerID,
            customerPhone
        );

        await Payment.create({
            orderId,
            paymentSessionId,
            orderAmount,
            orderCurrency,
            paymentStatus: "PENDING"
        });

        res.json({ paymentSessionId, orderId });

    } catch (error) {

        console.error("Error processing payment:", error.message);
        res.status(500).json({ message: "Error processing payment" });

    }
};


exports.getPaymentStatus = async (req, res) => {

    const orderId = req.params.orderId;

    try {

        const orderStatus = await getPaymentStatus(orderId);

        const order = await Payment.findOne({
            where: { orderId }
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Update payment status
        order.paymentStatus = orderStatus;

        await order.save();

        res.json({ orderStatus });

    } catch (error) {

        console.error("Error fetching payment status:", error.message);
        res.status(500).json({ message: "Error fetching payment status" });

    }
};