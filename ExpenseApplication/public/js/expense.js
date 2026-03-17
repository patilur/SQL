let allExpenses = [];
let editingExpenseId = null;
let token = localStorage.getItem('token');
const cashfree = Cashfree({ mode: "sandbox" });

/* ================= AI CATEGORY ================= */
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
            description
        });

        const category = res.data.category;

        categoryInput.value = category
            ? category.charAt(0).toUpperCase() + category.slice(1)
            : "";

    } catch (err) {
        console.error("AI Error:", err);
        categoryInput.value = "";
    }
}

/* ================= LOGOUT ================= */
document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem('token');
    alert("Logged out successfully");
    window.location.href = "/signin";
};

/* ================= JWT ================= */
function parseJwt(token) {
    try {
        if (!token) return {};
        return JSON.parse(atob(token.split('.')[1]));
    } catch {
        return {};
    }
}

/* ================= PREMIUM ================= */
function showPremiumFeatures() {
    document.getElementById("buyPremiumBtn").style.display = "none";
    document.getElementById("leaderboardBtn").style.display = "block";
    document.getElementById("premiumMessage").innerHTML = "Premium Member ";

    const premiumSection = document.getElementById("premiumSection");
    if (premiumSection) premiumSection.style.display = "block";
}

/* ================= FILTER ================= */
function filterExpenses(type) {
    const now = new Date();

    const filtered = allExpenses.filter(exp => {
        const expDate = new Date(exp.createdAt);

        if (type === "daily") {
            return expDate.toDateString() === now.toDateString();
        }

        if (type === "weekly") {
            const diff = (now - expDate) / (1000 * 60 * 60 * 24);
            return diff <= 7;
        }

        if (type === "monthly") {
            return expDate.getMonth() === now.getMonth() &&
                expDate.getFullYear() === now.getFullYear();
        }
    });

    displayFilteredExpenses(filtered);
}

function displayFilteredExpenses(expenses) {
    const list = document.getElementById("filteredList");
    list.innerHTML = "";

    expenses.forEach(exp => {
        const li = document.createElement("li");
        li.className = "list-group-item";

        li.innerText =
            `${exp.type === "income" ? '+' : '-'} ₹${exp.expenseamount} - ${exp.description} (${exp.category})`;

        list.appendChild(li);
    });
}

/* ================= DOWNLOAD ================= */
document.getElementById("downloadBtn").onclick = () => {
    const decoded = parseJwt(token);

    if (!decoded.isPremiumUser) {
        alert("Only Premium users can download");
        return;
    }

    let content = "Amount, Description, Category, Type\n";

    allExpenses.forEach(exp => {
        content += `${exp.expenseamount}, ${exp.description}, ${exp.category}, ${exp.type}\n`;
    });

    const blob = new Blob([content], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.csv";
    a.click();
};

/* ================= PAGE LOAD ================= */
window.addEventListener('DOMContentLoaded', () => {
    const decoded = parseJwt(token);

    if (decoded.isPremiumUser) {
        showPremiumFeatures();
    }

    fetchExpenses();
});

/* ================= FETCH ================= */
async function fetchExpenses() {
    try {
        const parent = document.getElementById("expenseList");
        parent.innerHTML = "";

        const res = await axios.get("http://localhost:3000/expense/getExpense", {
            headers: { Authorization: token }
        });

        allExpenses = res.data.data;

        allExpenses.forEach(displayExpenseOnScreen);
        updateSummary();

    } catch (err) {
        console.error(err);
    }
}

/* ================= ADD / EDIT ================= */
function onSubmitHandler(event) {
    event.preventDefault();

    const expenseDetails = {
        expenseamount: document.getElementById("expense").value,
        description: document.getElementById("desc").value,
        category: document.getElementById("category").value,
        type: document.getElementById("type").value
    };

    if (editingExpenseId) {
        axios.put(`http://localhost:3000/expense/edit/${editingExpenseId}`, expenseDetails, {
            headers: { Authorization: token }
        })
            .then(res => {
                const updated = res.data.data;

                const index = allExpenses.findIndex(e => e.id == editingExpenseId);
                if (index !== -1) allExpenses[index] = updated;

                removeExpenseFromScreen(editingExpenseId);
                displayExpenseOnScreen(updated);
                updateSummary();

                editingExpenseId = null;
                clearForm();
            });
    } else {
        axios.post("http://localhost:3000/expense/addExpense", expenseDetails, {
            headers: { Authorization: token }
        })
            .then(res => {
                allExpenses.push(res.data.data);

                displayExpenseOnScreen(res.data.data);
                updateSummary();
                clearForm();
            });
    }
}

/* ================= DISPLAY ================= */
function displayExpenseOnScreen(expense) {
    const parent = document.getElementById("expenseList");

    const li = document.createElement("li");
    li.id = expense.id;

    const isIncome = expense.type === "income";

    li.className = `list-group-item d-flex justify-content-between align-items-center 
        ${isIncome ? 'list-group-item-success' : 'list-group-item-danger'}`;

    li.innerHTML = `
        <div>
            <strong>${isIncome ? '+' : '-'} ₹${expense.expenseamount}</strong> 
            - ${expense.description} (${expense.category})
        </div>
        <div>
            <button class="btn btn-sm btn-info me-2"
                onclick="editExpense('${expense.id}','${expense.expenseamount}','${expense.description}','${expense.category}','${expense.type}')">
                Edit
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteExpense('${expense.id}')">
                Delete
            </button>
        </div>
    `;

    parent.appendChild(li);
}

/* ================= DELETE ================= */
window.deleteExpense = (id) => {
    axios.delete(`http://localhost:3000/expense/delete/${id}`, {
        headers: { Authorization: token }
    })
        .then(() => {
            allExpenses = allExpenses.filter(e => e.id != id);
            removeExpenseFromScreen(id);
            updateSummary();
        });
};

/* ================= EDIT ================= */
window.editExpense = (id, amount, desc, cat, type) => {
    document.getElementById("expense").value = amount;
    document.getElementById("desc").value = desc;
    document.getElementById("category").value = cat;
    document.getElementById("type").value = type;
    editingExpenseId = id;
};

/* ================= SUMMARY ================= */
function updateSummary() {
    let income = 0;
    let expense = 0;

    allExpenses.forEach(item => {
        if (item.type === "income") {
            income += Number(item.expenseamount);
        } else {
            expense += Number(item.expenseamount);
        }
    });

    document.getElementById("totalIncome").innerText = income;
    document.getElementById("totalExpense").innerText = expense;
    document.getElementById("balance").innerText = income - expense;
}

/* ================= HELPERS ================= */
function removeExpenseFromScreen(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function clearForm() {
    document.getElementById("expense").value = "";
    document.getElementById("desc").value = "";
    document.getElementById("category").value = "";
    document.getElementById("type").value = "";
}

/* ================= BUY PREMIUM ================= */
const buyBtn = document.getElementById("buyPremiumBtn");
if (buyBtn) {
    buyBtn.onclick = async () => {
        try {
            // Call backend to create payment
            const response = await axios.post("http://localhost:3000/pay", {}, {
                headers: { Authorization: token }
            });

            const data = response.data;

            if (!data.paymentSessionId) {
                console.error("Payment session not received");
                alert("Cannot initiate payment. Try again later.");
                return;
            }

            // Open Cashfree modal
            await cashfree.checkout({
                paymentSessionId: data.paymentSessionId,
                redirectTarget: "_modal"
            });

            // Optionally, check payment status after checkout
            const statusRes = await axios.get(`http://localhost:3000/payment-status/${data.orderId}`, {
                headers: { Authorization: token }
            });

            if (statusRes.data.orderStatus === "SUCCESS") {
                alert("🎉 You are now a Premium Member!");
                if (statusRes.data.token) {
                    localStorage.setItem('token', statusRes.data.token);
                    token = statusRes.data.token;
                }
                showPremiumFeatures();
            } else {
                alert("Payment failed. Please try again.");
            }

        } catch (err) {
            console.error("Payment Error:", err);
            alert("Error initiating payment");
        }
    };
}

/* ================= LEADERBOARD ================= */
const leaderboardBtn = document.getElementById("leaderboardBtn");

if (leaderboardBtn) {
    leaderboardBtn.onclick = async () => {
        try {
            const decoded = parseJwt(token);

            if (!decoded.isPremiumUser) {
                alert("Only premium users can view leaderboard");
                return;
            }

            const res = await axios.get("http://localhost:3000/premium/leaderboard", {
                headers: { Authorization: token }
            });

            const parent = document.getElementById("leaderboardList");
            parent.innerHTML = ""; // clear previous

            if (!res.data || res.data.length === 0) {
                parent.innerHTML = "<li class='list-group-item'>No leaderboard data</li>";
                return;
            }

            res.data.forEach(user => {
                const li = document.createElement("li");
                li.className = "list-group-item d-flex justify-content-between align-items-center";
                li.innerHTML = `
                    <span>${user.name}</span>
                    <span class="badge bg-primary rounded-pill">₹${user.totalExpense || 0}</span>
                `;
                parent.appendChild(li);
            });

        } catch (err) {
            console.error("Leaderboard error:", err);
            alert("Failed to load leaderboard");
        }
    };
}