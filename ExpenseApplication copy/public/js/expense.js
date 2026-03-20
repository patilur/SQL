let editingExpenseId = null;
const token = localStorage.getItem('token');
// Load users when page loads
window.addEventListener("DOMContentLoaded", () => {

    axios.get("http://localhost:3000/expense/getExpense", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {

            const expenses = res.data.data;

            expenses.forEach(expense => {
                // console.log("====", expense)
                displayExpenseOnScreen(expense);
            });

        })
        .catch(err => {

            if (err.response) {
                alert(err.response.data.message);
            } else {
                console.log(err);
            }

        });

});


// Form submit
function onSubmitHandler(event) {

    event.preventDefault();



    const expense = document.getElementById("expense").value;
    const description = document.getElementById("desc").value;
    const category = document.getElementById("category").value;

    if (!expense || !description || !category) {
        alert("Please fill all fields");
        return;
    }

    const expenseDetails = {
        expenseamount: expense,
        description,
        category
    };

    // UPDATE USER
    if (editingExpenseId) {

        axios.put(`http://localhost:3000/expense/edit/${editingExpenseId}`, expenseDetails, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {

                removeExpenseFromScreen(editingExpenseId);

                displayExpenseOnScreen(response.data.data);

                editingExpenseId = null;

                clearForm();

            })
            .catch((err) => {

                if (err.response) {
                    alert(err.response.data.message);
                } else {
                    console.log(err);
                }

            });

    }

    // CREATE USER
    else {

        axios.post("http://localhost:3000/expense/addExpense", expenseDetails, { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => {

                displayExpenseOnScreen(response.data.data);

                clearForm();

            })
            .catch(err => {

                if (err.response) {
                    alert(err.response.data.message);
                } else {
                    console.log(err);
                }

            });

    }

}



function displayExpenseOnScreen(expense) {

    const parentNode = document.getElementById("expenseList");

    const li = document.createElement("li");

    li.id = expense.id;

    li.innerHTML = `${expense.expenseamount} - ${expense.description} - ${expense.category}`;

    // DELETE BUTTON
    const deleteBtn = document.createElement("button");

    deleteBtn.textContent = "Delete";

    deleteBtn.onclick = () => {

        axios.delete(`http://localhost:3000/expense/delete/${expense.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => {

                removeExpenseFromScreen(expense.id);

            })
            .catch(err => console.log(err));

    };


    // EDIT BUTTON
    const editBtn = document.createElement("button");

    editBtn.textContent = "Edit";

    editBtn.onclick = () => {

        document.getElementById("expense").value = expense.expenseamount;
        document.getElementById("desc").value = expense.description;
        document.getElementById("category").value = expense.category;

        editingExpenseId = expense.id;

    };


    li.appendChild(deleteBtn);
    li.appendChild(editBtn);

    parentNode.appendChild(li);

}



function removeExpenseFromScreen(expenseID) {

    const parentNode = document.getElementById("expenseList");

    const childNode = document.getElementById(expenseID);

    if (childNode) {
        parentNode.removeChild(childNode);
    }

}


function clearForm() {

    document.getElementById("expense").value = "";
    document.getElementById("desc").value = "";
    document.getElementById("category").value = "";

}