import { navigate } from './handleNavigation.js';

export function attachPaymentFormHandler(payload = null) {
    document.getElementById('bookingId').value = payload != null ? payload.bookingId : null;
    document.getElementById('amount').value = payload != null ? payload.bookingTotalPrice : null;

    const paymentForm = document.getElementById('payment-form');
    paymentForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
            alert('You must be logged in to make a payment.'); // TODO: Change to html element, text popup
            navigate('login');
            return;
        }

        const bookingId = document.getElementById('bookingId').value;
        const amount = document.getElementById('amount').value;

        const response = await fetch('/api/payments/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ bookingId, amount, status: 'Pending' })
        });

        const result = await response.json();
        if (response.ok) {
            alert('Maksājums veiksmīgs!'); // TODO: Change to html element, text popup
            navigate('home');
        } else {
            alert('Kļūda maksājuma apstrādē: ' + result.message); // TODO: Change to html element, text popup
        }
    });
}
