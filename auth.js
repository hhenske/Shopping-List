let authToken = null;
let currentUser = null;
let isSignupMode = false;

window.addEventListener("DOMContentLoaded", () => {
  const mainContent = document.getElementById("main-content");
  const modal       = document.getElementById("auth-modal");

  // Expose to hide blur
  window.hideAuthModal = () => {
    modal.style.display           = "none";
    mainContent.classList.remove("blurred");
  };

  // Sign Up link only toggles mode
  document.getElementById("signup-toggle")
    .addEventListener("click", () => toggleMode(true));

  // Log In button toggles back *and* authenticates
  document.getElementById("login-toggle")
    .addEventListener("click", () => toggleMode(false))
  document.getElementById("signup-toggle").addEventListener("click", () => toggleMode(true));
   
  document.getElementById("auth-action-btn")
    .addEventListener("click", () => {
      authenticate(isSignupMode ? "signup" : "login");
    });
    
  // Show modal & blur on load
  showAuthModal();
});

function showAuthModal() {
  document.getElementById("auth-modal").style.display   = "block";
  document.getElementById("main-content").classList.add("blurred");
}

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

  // Restyle buttons
  document.getElementById("login-toggle").className  =
    signup ? "link-button" : "primary-button";
  document.getElementById("signup-toggle").className =
    signup ? "primary-button" : "link-button";
}

async function authenticate(type) {
  const email   = document.getElementById("auth-email").value;
  const password= document.getElementById("auth-password").value;
  const name    = document.getElementById("auth-name").value;
  const confirm = document.getElementById("auth-password-confirm").value;

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
    const res  = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (res.ok && data.response.user_id) {
      authToken        = data.response.token;
      currentUser      = data.response.user_id;
      window.authToken = authToken;
      hideAuthModal();
    } else {
      throw new Error(data.message || "Authentication failed");
    }
  } catch (err) {
    alert(err.message);
  }
}
