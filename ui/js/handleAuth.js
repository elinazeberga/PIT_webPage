import { navigate } from './handleNavigation.js';

export function attachFormHandlers() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();
            if (response.ok) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('userId', result.userId);
                alert('Pieslēgšanāš veiksmīga!'); // TODO: Change to html element, text popup
                navigate('home');
                location.reload();
            } else {
                alert('Kļūda pieslēgties: ' + result.message); // TODO: Change to html element, text popup
            }
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const licenseNr = document.getElementById('licenseNr').value;
            // const loyalty = document.getElementById('loyalty').value || null;
            const phone = document.getElementById('phone').value;

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, lastName, email, password, licenseNr, phone })
            });

            const result = await response.json();
            if (response.ok) {
                alert('Reģistrācija veiksmīga!'); // TODO: Change to html element, text popup
                navigate('login');
            } else {
                alert('Kļūda reģistrēties: ' + result.message); // TODO: Change to html element, text popup
            }
        });
    }
}
