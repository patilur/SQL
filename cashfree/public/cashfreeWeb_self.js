const cashfree = Cashfree({
  mode: "sandbox",
});

document.getElementById("renderBtn").addEventListener("click", async () => {
  try {

    const response = await fetch("http://localhost:3000/pay", {
      method: "POST",
    });

    const data = await response.json();
    const paymentSessionId = data.paymentSessionId;

    let checkoutOptions = {
      paymentSessionId: paymentSessionId,
      redirectTarget: "_self"   // open payment page in same tab
    };

    await cashfree.checkout(checkoutOptions);

  } catch (err) {
    console.error("Error:", err);
  }
});