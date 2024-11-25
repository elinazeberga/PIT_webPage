const content = document.getElementById('content');

function handleLogin(event) {
    event.preventDefault();
  
    const email = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.token) {
          alert('Login successful!');
          sessionStorage.setItem('jwtToken', data.token);
          window.location.href = '/admin/home';
        } else {
          alert('Login failed! Check your email and password.');
        }
      })
      .catch(error => {
        console.error('Error logging in:', error);
        alert('Login failed! An error occurred.');
      });
}