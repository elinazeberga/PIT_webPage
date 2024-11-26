import { navigate } from './handleNavigation.js';

export function attachBookingFormHandler(payload = null) {
    document.getElementById('carId').value = payload != null ? payload.cardId : null;

    const bookingForm = document.getElementById('booking-form');
    bookingForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const userId = localStorage.getItem('userId');
        const carId = document.getElementById('carId').value;
        const rentalStartDate = document.getElementById('rentalStartDate').value;
        const rentalEndDate = document.getElementById('rentalEndDate').value;
        const token = localStorage.getItem('token');

        if (!token || !userId) {
            alert('Nepieciešams pieslēgties, lai rezervētu auto.'); // TODO: Change to html element, text popup
            navigate('login');
            return;
        }

        const response = await fetch('/api/bookings/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId, carId, rentalStartDate, rentalEndDate, status: 'Pending' })
        });

        const result = await response.json();
        if (response.ok) {
            let payload = {
                bookingId: result.booking._id,
                bookingTotalPrice: result.booking.totalPrice
            }
            alert('Rezervācija veiksmīga!'); // TODO: Change to html element, text popup
            navigate('payment', payload);
        } else {
            alert('Kļūda rezervācijas veikšanā: ' + result.message); // TODO: Change to html element, text popup
        }
    });
}
