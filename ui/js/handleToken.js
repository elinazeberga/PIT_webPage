import { injectHTML } from './utils.js';
import { navigate } from './handleNavigation.js';

export function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('home');
    location.reload();
}

export function checkLoginStatus() {
    const token = localStorage.getItem('token');

    if (token) {
        injectHTML('components/nav-token.html', 'nav-placeholder', () => {
            const logout = document.getElementById('logout');
            if (logout) {
                logout.addEventListener('click', handleLogout);
            } else {
                console.error('Logout element not found');
            }
        });
    }
}