import { injectHTML } from './js/utils.js';
import { checkLoginStatus } from './js/handleToken.js';
import { navigate } from './js/handleNavigation.js';

window.navigate = navigate;

document.addEventListener('DOMContentLoaded', () => {
    injectHTML('components/nav.html', 'nav-placeholder');
    injectHTML('components/footer.html', 'footer-placeholder');

    const initialPage = 'home';
    navigate(initialPage);

    checkLoginStatus();
});