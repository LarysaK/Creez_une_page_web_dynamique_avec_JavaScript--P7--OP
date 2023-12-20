// CONSTANTS
const BASE_URL = "http://localhost:5678/api/";
const USERS_API = `${BASE_URL}users/login`;
const LOGIN_BUTTON = document.getElementById("se_connecter");

// EVENT LISTENER
LOGIN_BUTTON.addEventListener("click", loginUser);

// LOGIN USER FUNCTION
async function loginUser() {
    // RETRIEVE EMAIL AND PASSWORD
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        // CALL API TO VERIFY EMAIL AND PASSWORD
        const response = await fetch(USERS_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            // IF LOGIN IS SUCCESSFUL, CONVERT RESPONSE TO JSON
            const data = await response.json();

            // STORE TOKEN IN SESSION STORAGE
            sessionStorage.setItem("token", data.token);

            // REDIRECT TO THE HOME PAGE
            window.location.href = "index.html";
        } else {
            // IF EMAIL OR PASSWORD IS INCORRECT, DISPLAY ERROR MESSAGE
            const loginError = document.getElementById("login_error");
            loginError.innerHTML = "E-mail ou mot de passe incorrect";
            loginError.style.display = "flex";
        }
    } catch (error) {
        // HANDLE NETWORK ERRORS OR OTHER EXCEPTIONS
        console.error("An error occurred:", error);
        // Display a generic error message to the user
        const loginError = document.getElementById("login_error");
        loginError.innerHTML = "Une erreur s'est produite. Veuillez réessayer.";
        loginError.style.display = "flex";
    }
}
