let authToken = null;
let currentUser = null;

window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("auth-modal").style.display = "block";

    document.getElementById("login-btn").onclick = () => authenticate("login");
    document.getElementById("signup-btn").onclick = () => authenticate("signup");
});

async function authenticate(type) {
    const email = document.getElementById("auth-email").value;
    const password = document.getElementById("auth-password").value;

    const endpoint = type === "signup"
        ? "https://personalportfoliohah.bubbleapps.io/api/1.1/signup"
        : "https://personalportfoliohah.bubbleapps.io/api/1.1/login";

    const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok && data.response.user_id) {
        authToken = data.response.token;
        currentUser = data.response.user_id;
        window.authToken = authToken;

        document.getElementById("auth-modal").style.display = "none";
        if (typeof window.hideAuthModal === "function") {
            window.hideAuthModal(); // Unblur and hide modal
        }
    } else {
        alert("Authentication failed: " + (data.message || "Unknown error"));
    }
}
