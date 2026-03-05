window.addEventListener("DOMContentLoaded", () => {
    axios.get("http://localhost:3000/users/getUsers")
        .then((response) => {

            response.data.data.forEach(user => {
                showUserOnScreen(user);
            });

        })
        .catch((err) => console.log(err));
});

let editingUserId = null;

function onSubmitHandler(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const phoneno = document.getElementById('phoneno').value;
    const email = document.getElementById('email').value;

    const obj = {
        username,
        phoneno,
        email
    };

    if (editingUserId) {

        axios.put(`http://localhost:3000/users/update/${editingUserId}`, obj)
            .then((response) => {

                removeUserFromScreen(editingUserId);
                showUserOnScreen(response.data.updatedUser);

                editingUserId = null;

                document.getElementById('username').value = '';
                document.getElementById('phoneno').value = '';
                document.getElementById('email').value = '';

            })
            .catch((err) => console.log(err));

    } else {

        axios.post('http://localhost:3000/users/addUser', obj)
            .then((response) => {

                showUserOnScreen(response.data.newUserDetail);

                document.getElementById('username').value = '';
                document.getElementById('phoneno').value = '';
                document.getElementById('email').value = '';

            })
            .catch((error) => {
                console.log(error);
            });

    }
}

function editUser(userId, username, email, phoneno) {

    document.getElementById('username').value = username;
    document.getElementById('email').value = email;
    document.getElementById('phoneno').value = phoneno;

    editingUserId = userId;
}

function showUserOnScreen(user) {

    const parentNode = document.getElementById('users');

    const childHTML = `
        <li id=${user.id}>
            ${user.username} - ${user.email} - ${user.phoneno}
            <button onclick="deleteUser(${user.id})">Delete</button>
            <button onclick="editUser(${user.id}, '${user.username}', '${user.email}', '${user.phoneno}')">Edit</button>
        </li>
    `;

    parentNode.innerHTML += childHTML;
}

function deleteUser(userId) {

    axios.delete(`http://localhost:3000/users/delete/${userId}`)
        .then(() => {
            removeUserFromScreen(userId);
        })
        .catch(err => console.log(err));
}

function removeUserFromScreen(userId) {

    const parentNode = document.getElementById('users');
    const childNode = document.getElementById(userId);

    if (childNode) {
        parentNode.removeChild(childNode);
    }
}