const btnConnexion = document.getElementById("login-validation");

async function verifLogin(response) {
    const errorLogin = document.getElementById("error-login");

    try {
        if (response.ok) {
            const responseData = await response.json();
            handleSuccessfulLogin(responseData.token);
        } else {
            errorLogin.innerText = `Erreur dans l’identifiant ou le mot de passe`;
        }
    } catch (error) {
        console.error("An error occurred while processing the login response:", error);
        // Handle error appropriately, e.g., show a generic error message to the user
    }
}

function handleSuccessfulLogin(token) {
    // Handle successful login, e.g., store the token, redirect, update UI, etc.
    console.log("Successfully logged in with token:", token);
    sessionStorage.setItem("token", JSON.stringify(token));
    window.location.href = "index.html";
}

btnConnexion.addEventListener("click", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email-info").value;
    const password = document.getElementById("password-info").value;

    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: "POST",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        await verifLogin(response);
    } catch (error) {
        console.error("An error occurred while processing the login request:", error);
        // Handle error appropriately, e.g., show a generic error message to the user
    }
});


