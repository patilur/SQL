

// Form submit
function onSubmitHandler(event) {

    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!name || !email || !password) {
        alert("Please fill all fields");
        return;
    }

    const userDetails = {
        name, email, password
    };



    // CREATE USER
    axios.post("http://localhost:3000/expense/user/addUser", userDetails)
        .then((response) => {

            console.log(response.data.data);

            alert("Signup successful");

            // clearForm();

            // Redirect to login page
            window.location.href = "/signin";

        })
        .catch(err => {

            if (err.response) {
                alert(err.response.data.message);
            } else {
                console.log(err);
            }

        });

}
function clearForm() {
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
}




