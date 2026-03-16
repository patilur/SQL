const cashfree = Cashfree({
  mode: "sandbox",
});

document.getElementById("renderBtn").addEventListener("click", async () => {
  try {

    // Fetch payment session ID from backend
    const response = await fetch("http://localhost:3000/pay", {
      method: "POST",
    });

    const data = await response.json();
    const paymentSessionId = data.paymentSessionId;
    const orderId = data.orderId;   // IMPORTANT

    // Inline checkout options
    let checkoutOptions = {
      paymentSessionId: paymentSessionId,

      redirectTarget: document.getElementById("cf_checkout"),

      appearance: {
        width: "325px",
        height: "400px",
      },
    };

    const result = await cashfree.checkout(checkoutOptions);

    if (result.error) {
      console.log("Payment error or user closed checkout");
      console.log(result.error);
    }

    if (result.redirect) {
      console.log("Payment redirected");
    }

    if (result.paymentDetails) {

      console.log("Payment completed");
      console.log(result.paymentDetails.paymentMessage);

      const response = await fetch(`http://localhost:3000/payment-status/${orderId}`);
      const data = await response.json();

      alert("Your payment is " + data.orderStatus);
    }

  } catch (err) {
    console.error("Error:", err);
  }
});