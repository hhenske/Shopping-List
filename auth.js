

async function signUp(email, password, name) {
  return await supabase.auth.signUp({
    email, 
    password,
    options: {
      data: { name }
    }
  });
}

async function logIn(email, password) {
  return await supabase.auth.signInWithPassword({ email, password });
}

function getUser() {
  return supabase.auth.getUser();
}
console.log("Auth script loaded");

document.addEventListener('DOMContentLoaded', () => {

  if (!window.client) {
    console.error("Supabase client not found. Waiting for initialization...");

    const waitForClient = setInterval(() => {
      if (window.client) {
        clearInterval(waitForClient);
      
        window.client.auth.exchangeCodeForSession().then(({ data, error }) => {
          if (error) {
            console.error("Error getting session from URL:", error.message);
          } else if (data.session) {
            console.log("Session restored from URL", data.session)
          }
        });
      }
    }, 50)
  } else {
    window.client.auth.exchangeCodeForSession().then(({ data, error }) => {
      if (error) {
        console.error("Error getting session from URL:", error.message);
      } else if (data.session) {
        console.log("Session restored form URL", data.session);
      }
    });
  }
});



// Auth toggle elements
  const authTitle = document.getElementById('auth-title');
  const nameField = document.getElementById('auth-name');
  const emailField = document.getElementById('auth-email');
  const passwordField = document.getElementById('auth-password');
  const confirmPasswordField = document.getElementById('auth-confirm-password');
  const actionBtn = document.getElementById('auth-action-btn');
  const toggleLink = document.getElementById('toggle-auth-mode');
  console.log("toggleLink is", toggleLink);
//default mode is log in
  let isSignUp = false;

  function updateAuthForm() {
    console.log("Updating form for", isSignUp ? "Sign Up" : "Log In");
    authTitle.textContent = isSignUp ? 'Sign Up' : 'Log In';
    nameField.style.display = isSignUp ? 'block' : 'none';
    confirmPasswordField.style.display = isSignUp ? 'block' : 'none';
    actionBtn.textContent = isSignUp ? 'Sign Up' : 'Log In';
    toggleLink.textContent = isSignUp ? "Already have an account? Log In" : "Don't have an account? Sign Up";
  }

  toggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    isSignUp = !isSignUp;
    console.log("Toggled auth mod. isSignUp =", isSignUp);
    updateAuthForm();
  });

  updateAuthForm();

  actionBtn.addEventListener('click', async () => {
    const email = emailField.value;
    const password = passwordField.value;

    if (isSignUp) {
      const confirmPassword = confirmPasswordField.value;
      const name = nameField.value;

      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      const { data, error } = await signUp(email, password, name);
      if (error) {
        alert(error.message);
      } else {
        alert("Sign up successfull");
        hideAuthModal();
      }
    } else {
        const { data, error } = await logIn(email, password);
        if (error) {
          alert(error.message);
        } else {
          alert("Login successfull");
          hideAuthModal();
        }
      }
    });
  