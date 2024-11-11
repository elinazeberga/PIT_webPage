const content = document.getElementById('content');

function handleLogin(event) {
    event.preventDefault();
  
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    window.location.href = '/admin/main';
    fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.token) {
          alert('Login successful!');
          window.location.href = '/admin/main';
        } else {
          alert('Login failed! Check your username and password.');
        }
      })
      .catch(error => {
        console.error('Error logging in:', error);
        alert('Login failed! An error occurred.');
      });
}