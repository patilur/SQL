const { Cashfree, CFEnvironment } = require("cashfree-pg");
require("dotenv").config();

const cashfree = new Cashfree(
    CFEnvironment.SANDBOX,
    process.env.CASHFREE_APP_ID,
    process.env.CASHFREE_SECRET_KEY
);

const createOrder = async (orderId, amount, customerID, customerPhone) => {

    const request = {
        order_id: orderId,
        order_amount: amount,
        order_currency: "INR",

        customer_details: {
            customer_id: String(customerID),
            customer_phone: customerPhone
        },

        order_meta: {
            return_url: `http://localhost:3000/payment-status/${orderId}`,
            payment_methods: "cc,dc,upi"
        },

        order_expiry_time: new Date(Date.now() + 60 * 60 * 1000).toISOString()
    };

    const response = await cashfree.PGCreateOrder(request);

    return response.data.payment_session_id;
};

module.exports = { createOrder };