let allExpenses = [];
let editingExpenseId = null;
let token = localStorage.getItem("token");

const cashfree = new Cashfree({
    mode: "sandbox"
});

let currentPage = 1;
let rowsPerPage = localStorage.getItem("rowsPerPage") || 10;

/* ================= JWT ================= */
function parseJwt(token) {
    try {
        if (!token) return {};
        return JSON.parse(atob(token.split(".")[1]));
    } catch {
        return {};
    }
}

/* ================= PREMIUM ================= */
function showPremiumFeatures() {
    const buyBtn = document.getElementById("buyPremiumBtn");
    const leaderboardBtn = document.getElementById("leaderboardBtn");
    const premiumMsg = document.getElementById("premiumMessage");
    const premiumSection = document.getElementById("premiumSection");

    if (buyBtn) buyBtn.style.display = "none";
    if (leaderboardBtn) leaderboardBtn.style.display = "block";
    if (premiumMsg) premiumMsg.innerText = "Premium Member";
    if (premiumSection) premiumSection.style.display = "block";
}

/* ================= FETCH ================= */
async function fetchExpenses(page = 1) {
    try {
        const res = await axios.get(
            `http://localhost:3000/expense/getExpense?page=${page}&limit=${rowsPerPage}`,
            {
                headers: { Authorization: token }
            }
        );

        const parent = document.getElementById("expenseList");
        if (!parent) return;

        parent.innerHTML = "";

        allExpenses = res.data.data || [];

        allExpenses.forEach(displayExpenseOnScreen);
        updateSummary();

        currentPage = res.data.currentPage;

        document.getElementById("pageInfo").innerText =
            `Page ${res.data.currentPage} of ${res.data.totalPages}`;

        document.getElementById("prevPage").disabled = currentPage === 1;
        document.getElementById("nextPage").disabled =
            currentPage === res.data.totalPages;

    } catch (err) {
        console.error("Fetch Error:", err);
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
        axios.put(
            `http://localhost:3000/expense/edit/${editingExpenseId}`,
            expenseDetails,
            { headers: { Authorization: token } }
        ).then(() => {
            fetchExpenses(currentPage);
            editingExpenseId = null;
            clearForm();
        }).catch(err => console.error(err));
    } else {
        axios.post(
            "http://localhost:3000/expense/addExpense",
            expenseDetails,
            { headers: { Authorization: token } }
        ).then(() => {
            fetchExpenses(currentPage);
            clearForm();
        }).catch(err => console.error(err));
    }
}

/* ================= DISPLAY ================= */
function displayExpenseOnScreen(expense) {
    const parent = document.getElementById("expenseList");
    if (!parent) return;

    const li = document.createElement("li");
    li.id = expense.id;

    const isIncome = expense.type === "income";

    li.className = `list-group-item d-flex justify-content-between align-items-center 
        ${isIncome ? "list-group-item-success" : "list-group-item-danger"}`;

    li.innerHTML = `
        <div>
            <strong>${isIncome ? "+" : "-"} ₹${expense.expenseamount}</strong> 
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
    }).then(() => {
        fetchExpenses(currentPage);
    }).catch(err => console.error(err));
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
        if (item.type === "income") income += Number(item.expenseamount);
        else expense += Number(item.expenseamount);
    });

    document.getElementById("totalIncome").innerText = income;
    document.getElementById("totalExpense").innerText = expense;
    document.getElementById("balance").innerText = income - expense;
}

/* ================= FILTER ================= */
function filterExpenses(type) {
    const now = new Date();

    const filtered = allExpenses.filter(exp => {
        const expDate = new Date(exp.createdAt);

        if (type === "daily")
            return expDate.toDateString() === now.toDateString();

        if (type === "weekly")
            return (now - expDate) / (1000 * 60 * 60 * 24) <= 7;

        if (type === "monthly")
            return expDate.getMonth() === now.getMonth() &&
                expDate.getFullYear() === now.getFullYear();
    });

    const list = document.getElementById("filteredList");
    if (!list) return;

    list.innerHTML = "";

    filtered.forEach(exp => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.innerText =
            `${exp.type === "income" ? "+" : "-"} ₹${exp.expenseamount} - ${exp.description}`;
        list.appendChild(li);
    });
}

/* ================= DOWNLOAD ================= */
function downloadExpenses() {
    const decoded = parseJwt(token);

    if (!decoded.isPremiumUser) {
        alert("Only Premium users can download");
        return;
    }

    let content = "Amount,Description,Category,Type\n";

    allExpenses.forEach(exp => {
        content += `${exp.expenseamount},${exp.description},${exp.category},${exp.type}\n`;
    });

    const blob = new Blob([content], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.csv";
    a.click();
}

/* ================= BUY PREMIUM ================= */
async function handleBuyPremium() {
    try {
        console.log("BUY CLICKED");

        const res = await axios.post("http://localhost:3000/pay", {}, {
            headers: { Authorization: token }
        });

        const data = res.data;

        if (!data.paymentSessionId) {
            alert("Payment session missing");
            return;
        }

        await cashfree.checkout({
            paymentSessionId: data.paymentSessionId,
            redirectTarget: "_modal"
        });

        const status = await axios.get(
            `http://localhost:3000/payment-status/${data.orderId}`,
            { headers: { Authorization: token } }
        );

        if (status.data.orderStatus === "SUCCESS") {
            alert("🎉 Premium Activated!");

            if (status.data.token) {
                localStorage.setItem("token", status.data.token);
                token = status.data.token;
            }

            showPremiumFeatures();
        } else {
            alert("Payment Failed");
        }

    } catch (err) {
        console.error("Payment Error:", err);
        alert("Payment error");
    }
}

/* ================= AI CATEGORY ================= */
async function suggestCategory(description) {
    try {
        console.log("Calling AI API...");

        const categoryInput = document.getElementById("category");
        categoryInput.value = "Detecting...";

        const res = await axios.post("http://localhost:3000/ask/category", {
            description
        });

        const category = res.data.category;

        categoryInput.value = category
            ? category.charAt(0).toUpperCase() + category.slice(1)
            : "";

    } catch (err) {
        console.error("AI Error:", err.response?.data || err.message);
        document.getElementById("category").value = "";
    }
}

/* ================= INIT ================= */
window.addEventListener("DOMContentLoaded", () => {

    const decoded = parseJwt(token);
    if (decoded.isPremiumUser) showPremiumFeatures();

    // pagination
    document.getElementById("prevPage")?.addEventListener("click", () => {
        if (currentPage > 1) fetchExpenses(currentPage - 1);
    });

    document.getElementById("nextPage")?.addEventListener("click", () => {
        fetchExpenses(currentPage + 1);
    });

    // rows dropdown
    const dropdown = document.getElementById("rowsPerPage");
    if (dropdown) {
        dropdown.value = rowsPerPage;
        dropdown.onchange = () => {
            rowsPerPage = dropdown.value;
            localStorage.setItem("rowsPerPage", rowsPerPage);
            currentPage = 1;
            fetchExpenses(currentPage);
        };
    }

    // buttons
    document.getElementById("buyPremiumBtn")?.addEventListener("click", handleBuyPremium);
    document.getElementById("downloadBtn")?.addEventListener("click", downloadExpenses);

    document.getElementById("logoutBtn")?.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "/signin";
    });

    // suggest category
    document.getElementById("suggestBtn")?.addEventListener("click", () => {
        const desc = document.getElementById("desc").value;

        if (!desc) {
            alert("Enter description first");
            return;
        }

        suggestCategory(desc);
    });

    // initial load
    fetchExpenses(currentPage);
});

function clearForm() {
    document.getElementById("expense").value = "";
    document.getElementById("desc").value = "";
    document.getElementById("category").value = "";

    document.getElementById("type").selectedIndex = 0;

    editingExpenseId = null;
}
document.getElementById("leaderboardBtn")?.addEventListener("click", async () => {
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
        parent.innerHTML = "";

        if (!res.data || res.data.length === 0) {
            parent.innerHTML = "<li class='list-group-item'>No data</li>";
            return;
        }

        res.data.forEach(user => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between";

            li.innerHTML = `
                <span>${user.name}</span>
                <span>₹${user.totalExpense || 0}</span>
            `;

            parent.appendChild(li);
        });

    } catch (err) {
        console.error("Leaderboard Error:", err);
        alert("Failed to load leaderboard");
    }
});