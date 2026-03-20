let editingUserId = null;

// Load users when page loads
window.addEventListener("DOMContentLoaded", () => {

    axios.get("http://localhost:3000/users/getUsers")
        .then((res) => {

            const users = res.data.data;

            users.forEach(user => {
                displayUserOnScreen(user);
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

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const phoneno = document.getElementById("phoneno").value;

    const userDetails = {
        username,
        email,
        phoneno
    };

    // Update User
    if (editingUserId) {

        axios.put(`http://localhost:3000/users/update/${editingUserId}`, userDetails)
            .then((response) => {

                removeUserFromScreen(editingUserId);

                displayUserOnScreen(response.data.data);

                editingUserId = null;

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

        axios.post("http://localhost:3000/users/addUser", userDetails)
            .then((response) => {

                displayUserOnScreen(response.data.data);

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



function displayUserOnScreen(user) {

    const parentNode = document.getElementById("users");

    const li = document.createElement("li");

    li.id = user.id;

    li.innerHTML = `${user.username} - ${user.email} - ${user.phoneno}`;

    // DELETE BUTTON
    const deleteBtn = document.createElement("button");

    deleteBtn.textContent = "Delete";

    deleteBtn.onclick = () => {

        axios.delete(`http://localhost:3000/users/delete/${user.id}`)
            .then(() => {

                removeUserFromScreen(user.id);

            })
            .catch(err => console.log(err));

    };


    // EDIT BUTTON
    const editBtn = document.createElement("button");

    editBtn.textContent = "Edit";

    editBtn.onclick = () => {

        document.getElementById("username").value = user.username;
        document.getElementById("email").value = user.email;
        document.getElementById("phoneno").value = user.phoneno;

        editingUserId = user.id;

    };


    li.appendChild(deleteBtn);
    li.appendChild(editBtn);

    parentNode.appendChild(li);

}



function removeUserFromScreen(userId) {

    const parentNode = document.getElementById("users");

    const childNode = document.getElementById(userId);

    if (childNode) {
        parentNode.removeChild(childNode);
    }

}


function clearForm() {

    document.getElementById("username").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phoneno").value = "";

}