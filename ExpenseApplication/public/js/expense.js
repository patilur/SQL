// expense.js
let editingExpenseId = null;
let token = localStorage.getItem('token');
const cashfree = Cashfree({ mode: "sandbox" }); // Initializing Cashfree V3


const suggestBtn = document.getElementById("suggestBtn");
const descInput = document.getElementById("desc");
const categoryInput = document.getElementById("category");

suggestBtn.addEventListener("click", () => {
    const description = descInput.value;

    if (!description) {
        alert("Please enter description first");
        return;
    }

    suggestCategory(description);
});

async function suggestCategory(description) {
    try {
        categoryInput.value = "Detecting...";

        const res = await axios.post("http://localhost:3000/ask/category", {
            description: description
        });

        const category = res.data.category;
        console.log("==", category)

        if (category) {
            categoryInput.value =
                category.charAt(0).toUpperCase() + category.slice(1);
        } else {
            categoryInput.value = "";
        }

    } catch (err) {
        console.error("AI Error:", err);
        categoryInput.value = "";
    }
}
/* ================= LOGOUT LOGIC ================= */
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.onclick = () => {
        localStorage.removeItem('token'); // Clear session token
        alert("Logged out successfully");
        window.location.href = "/signin"; // Redirect to login page
    };
}

/* ================= JWT PARSER ================= */
function parseJwt(token) {
    try {
        if (!token) return {};
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64)); // Decode payload to check isPremiumUser
    } catch (err) {
        return {};
    }
}

/* ================= PREMIUM UI UPDATES ================= */
function showPremiumFeatures() {
    const buyBtn = document.getElementById("buyPremiumBtn");
    const leaderboardBtn = document.getElementById("leaderboardBtn");
    const premiumMsg = document.getElementById("premiumMessage");

    if (buyBtn) buyBtn.style.display = "none"; // Hide buy button for premium users
    if (leaderboardBtn) leaderboardBtn.style.display = "block"; // Show leaderboard access
    if (premiumMsg) premiumMsg.innerHTML = "Premium Member ";
}

/* ================= PAGE LOAD INITIALIZATION ================= */
window.addEventListener('DOMContentLoaded', () => {
    const decodedToken = parseJwt(token);

    if (decodedToken.isPremiumUser) {
        showPremiumFeatures();
    } else {
        const leaderboardBtn = document.getElementById("leaderboardBtn");
        if (leaderboardBtn) leaderboardBtn.style.display = "none";
    }

    fetchExpenses(); // Load existing user expenses
});

/* ================= EXPENSE OPERATIONS ================= */
async function fetchExpenses() {
    try {
        const parent = document.getElementById("expenseList");
        parent.innerHTML = "";

        const res = await axios.get("http://localhost:3000/expense/getExpense", {
            headers: { Authorization: token }
        });

        res.data.data.forEach(expense => displayExpenseOnScreen(expense)); // Display each record
    } catch (err) {
        console.error("Error loading expenses:", err);
    }
}

function onSubmitHandler(event) {
    event.preventDefault();

    const expenseDetails = {
        expenseamount: document.getElementById("expense").value,
        description: document.getElementById("desc").value,
        category: document.getElementById("category").value
    };

    if (editingExpenseId) {
        axios.put(`http://localhost:3000/expense/edit/${editingExpenseId}`, expenseDetails, {
            headers: { Authorization: token }
        })
            .then(res => {
                removeExpenseFromScreen(editingExpenseId);
                displayExpenseOnScreen(res.data.data);
                editingExpenseId = null;
                clearForm();
            }).catch(err => alert(err.response.data.message));
    } else {
        axios.post("http://localhost:3000/expense/addExpense", expenseDetails, {
            headers: { Authorization: token }
        })
            .then(res => {
                displayExpenseOnScreen(res.data.data); // Add new entry to UI
                clearForm();
            }).catch(err => alert(err.response.data.message));
    }
}

function displayExpenseOnScreen(expense) {
    const parentNode = document.getElementById("expenseList");
    const li = document.createElement("li");
    li.id = expense.id;
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
        <div><strong>₹${expense.expenseamount}</strong> - ${expense.description} (${expense.category})</div>
        <div>
            <button class="btn btn-sm btn-info me-2" onclick="editExpense('${expense.id}','${expense.expenseamount}','${expense.description}','${expense.category}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteExpense('${expense.id}')">Delete</button>
        </div>`;
    parentNode.appendChild(li);
}

window.deleteExpense = (id) => {
    axios.delete(`http://localhost:3000/expense/delete/${id}`, { headers: { Authorization: token } })
        .then(() => removeExpenseFromScreen(id))
        .catch(err => console.log(err));
};

window.editExpense = (id, amount, desc, cat) => {
    document.getElementById("expense").value = amount;
    document.getElementById("desc").value = desc;
    document.getElementById("category").value = cat;
    editingExpenseId = id;
};

/* ================= PAYMENT INTEGRATION ================= */
const buyBtn = document.getElementById("buyPremiumBtn");
if (buyBtn) {
    buyBtn.onclick = async () => {
        try {
            const response = await fetch("http://localhost:3000/pay", {
                method: "POST",
                headers: { "Authorization": token }
            });
            const data = await response.json();

            // Open Cashfree modal
            await cashfree.checkout({
                paymentSessionId: data.paymentSessionId,
                redirectTarget: "_modal",
            });

            // Verify payment status
            const responseStatus = await fetch(`http://localhost:3000/payment-status/${data.orderId}`, {
                headers: { "Authorization": token }
            });
            const statusData = await responseStatus.json();

            if (statusData.orderStatus === "SUCCESS") {
                alert("🎉 Congratulations! You are now a Premium Member.");
                if (statusData.token) {
                    localStorage.setItem('token', statusData.token); // Store updated token
                    token = statusData.token;
                }
                showPremiumFeatures();
            } else {
                alert("Transaction Failed ❌");
            }
        } catch (err) {
            console.error("Payment Error:", err);
        }
    };
}

/* ================= LEADERBOARD ================= */
const leaderboardBtn = document.getElementById("leaderboardBtn");
if (leaderboardBtn) {
    leaderboardBtn.onclick = async () => {
        try {
            const res = await axios.get("http://localhost:3000/premium/leaderboard", {
                headers: { Authorization: token }
            });
            const parent = document.getElementById("leaderboardList");
            parent.innerHTML = "<h4>Leaderboard</h4>";
            res.data.forEach(user => {
                const li = document.createElement("li");
                li.className = "list-group-item d-flex justify-content-between align-items-center";
                li.innerHTML = `<span>${user.name}</span> <span class="badge bg-primary rounded-pill">₹${user.totalExpense || 0}</span>`;
                parent.appendChild(li);
            });
        } catch (err) {
            console.log("Leaderboard error:", err);
        }
    };
}

/* ================= HELPERS ================= */
function removeExpenseFromScreen(id) {
    const child = document.getElementById(id);
    if (child) child.remove();
}

function clearForm() {
    document.getElementById("expense").value = "";
    document.getElementById("desc").value = "";
    document.getElementById("category").value = "";
}