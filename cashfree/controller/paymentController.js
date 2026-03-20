const path = require("path");

const {
    createOrder,
    getPaymentStatus: fetchPaymentStatus
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
    console.log("Checking payment status for:", orderId);
    try {

        const paymentStatus = await fetchPaymentStatus(orderId);
        console.log("Payment status:", paymentStatus);
        if (paymentStatus === "SUCCESS") {

            await Payment.update(
                { paymentStatus: "SUCCESS" },
                { where: { orderId } }
            );

        } else if (paymentStatus === "FAILED") {

            await Payment.update(
                { paymentStatus: "FAILED" },
                { where: { orderId } }
            );

        }

        res.json({ orderStatus: paymentStatus });

    } catch (error) {

        console.error("Error fetching payment status:", error);
        res.status(500).json({ message: "Error fetching payment status" });

    }
};