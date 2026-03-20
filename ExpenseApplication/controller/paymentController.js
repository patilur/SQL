const path = require("path");
const jwt = require("jsonwebtoken");
const { createOrder, getPaymentStatus: fetchPaymentStatus } = require("../services/cashfreeService");
const Payment = require("../model/paymentModel");
const User = require("../model/signupModel");
const dotenv = require("dotenv");
dotenv.config();

/* ================= PAYMENT PAGE ================= */
exports.getPaymentPage = (req, res) => {
    res.sendFile(path.join(__dirname, "../view/index.html"));
};

/* ================= CREATE ORDER ================= */
exports.processPayment = async (req, res) => {
    const orderId = "ORDER-" + Date.now();
    const orderAmount = 2000;
    const orderCurrency = "INR";
    const customerID = req.user.id.toString();
    const customerPhone = req.user.phone || "9999999999";

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
            paymentStatus: "PENDING",
            userId: req.user.id
        });

        res.status(200).json({ paymentSessionId, orderId });
    } catch (error) {
        console.error("Error processing payment:", error);
        res.status(500).json({ message: "Error creating payment order" });
    }
};

/* ================= VERIFY PAYMENT ================= */
exports.getPaymentStatus = async (req, res) => {
    const orderId = req.params.orderId;

    try {
        const paymentStatus = await fetchPaymentStatus(orderId);
        const payment = await Payment.findOne({ where: { orderId } });

        if (!payment) {
            return res.status(404).json({ message: "Payment record not found" });
        }

        if (paymentStatus === "SUCCESS") {
            // 1. Update Payment record
            await payment.update({ paymentStatus: "SUCCESS" });

            // 2. Update User premium status
            await User.update(
                { isPremiumUser: true },
                { where: { id: req.user.id } }
            );

            // 3. GENERATE FRESH TOKEN
            // Note: Using the exact same secret key as your userController.js
            const newToken = jwt.sign(
                {
                    userId: req.user.id,
                    isPremiumUser: true
                },
                process.env.JWT_SECRET
            );

            // 4. Send token back to frontend
            return res.status(200).json({
                orderStatus: "SUCCESS",
                token: newToken
            });

        } else {
            await payment.update({ paymentStatus: "FAILED" });
            return res.status(200).json({ orderStatus: "FAILED" });
        }

    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ message: "Error checking payment status" });
    }
};