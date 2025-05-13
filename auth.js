let authToken = null;
let currentUser = null;
let isSignupMode = false;

// Show the modal and blur the page on load
window.addEventListener("DOMContentLoaded", () => {
  const mainContent = document.getElementById("main-content");
  const modal = document.getElementById("auth-modal");

  // Expose so we can un‐blur after login/signup
  window.hideAuthModal = () => {
    modal.style.display = "none";
    mainContent.classList.remove("blurred");
  };

  // Wire up the toggles
  document.getElementById("login-toggle")
    .addEventListener("click", () => toggleMode(false));
  document.getElementById("signup-toggle")
    .addEventListener("click", () => toggleMode(true));

  // Start in Log In mode
  showAuthModal();
});

// Show modal + blur
function showAuthModal() {
  document.getElementById("auth-modal").style.display = "block";
  document.getElementById("main-content").classList.add("blurred");
}

// Switch between Log In and Sign Up modes
function toggleMode(signup) {
  isSignupMode = signup;

  // Update title
  document.getElementById("auth-title").textContent =
    signup ? "Sign Up" : "Log In";

  // Show/hide extra fields
  document.getElementById("auth-name")
    .classList.toggle("hidden", !signup);
  document.getElementById("auth-password-confirm")
    .classList.toggle("hidden", !signup);

  // Style toggles
  document.getElementById("login-toggle").className =
    signup ? "link-button" : "primary-button";
  document.getElementById("signup-toggle").className =
    signup ? "primary-button" : "link-button";

  // The active toggle also triggers authenticate immediately
  authenticate(signup ? "signup" : "login");
}

// Perform the actual login/sign‑up call
async function authenticate(type) {
  const email = document.getElementById("auth-email").value;
  const password = document.getElementById("auth-password").value;
  const name = document.getElementById("auth-name").value;
  const confirm = document.getElementById("auth-password-confirm").value;

  // If in sign‑up mode, validate passwords match first
  if (type === "signup" && password !== confirm) {
    return alert("Passwords do not match");
  }

  const endpoint = type === "signup"
    ? "https://personalportfoliohah.bubbleapps.io/api/1.1/signup"
    : "https://personalportfoliohah.bubbleapps.io/api/1.1/login";

  const payload = type === "signup"
    ? { email, password, name }
    : { email, password };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (res.ok && data.response.user_id) {
      authToken = data.response.token;
      currentUser = data.response.user_id;
      window.authToken = authToken;       // expose globally
      hideAuthModal();                    // un‐blur & hide
    } else {
      throw new Error(data.message || "Authentication failed");
    }
  } catch (err) {
    alert(err.message);
  }
}
