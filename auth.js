const authTitle = document.getElementById('auth-title');
const nameField = document.getElementById('auth-name');
const emailField = document.getElementById('auth-email');
const passwordField = document.getElementById('auth-password');
const confirmPasswordField = document.getElementById('auth-confirm-password');
const actionBtn = document.getElementById('auth-action-btn');
const toggleLink = document.getElementById('toggle-auth-mode');

let isSignUp = false;

toggleLink.addEventListener('click', (e) => {
  e.preventDefault();
  isSignUp = !isSignUp;

  authTitle.textContent = isSignUp ? 'Sign Up' : 'Log In';
  nameField.style.display = isSignUp ? 'block' : 'none';
  confirmPasswordField.style.display = isSignUp ? 'block' : 'none';
  actionBtn.textContent = isSignUp ? 'Sign Up' : 'Log In';
  toggleLink.textContent = isSignUp ? 'Log In' : 'Sign Up';
});
