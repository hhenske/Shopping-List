import { createClient } from '@supabase/supabase-js';

const supabaseURL = 'https://ojltmztuzqgfsgnpsidh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qbHRtenR1enFnZnNnbnBzaWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyNjIyMTIsImV4cCI6MjA2MjgzODIxMn0.vbYazcB_2vJJApl6qfyBcRJc7mRMY3ay32VvV7Nio0U';
export const supabase = createClient(supabaseURL, supabaseKey);

export async function signUp(email, password, name) {
  return await supabase.auth.signUp({
    email, 
    password,
    options: {
      data: { name }
    }
  });
}

export async function logIn(email, password) {
  return await supabase.auth.signInWithPassword({ email, password });
}

export function getUser() {
  return supabase.auth.getUser();
}


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


actionBtn.addEventListener('click', async () => {
  const email = emailField.emailField.value;
  const password = passwordField.value;

  if (isSignUp) {
    const confirmPassword = confirmPasswordField.value;
    const name = nameField.value;

    if (password !== confirmPassword) {
      
    }
  }
}
)