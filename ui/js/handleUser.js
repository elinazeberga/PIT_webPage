function getPayment(bookingId) {
    const token = localStorage.getItem('token');

    fetch(`/api/payments/booking/${bookingId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(payment => {
        document.getElementById('user-payments').innerHTML = `
            <div class="booking">
                <p>Rezervācijas ID: ${bookingId}</p>
                <p>Summa: ${payment.amount}</p>
                <p>Maksājuma datums: ${new Date(payment.paymentDate).toLocaleDateString()}</p>
                <p>Status: ${payment.status}</p>
            </div>
        `;
    });
}

export function loadUserProfile() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    fetch(`/api/auth/profile/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('user-info').innerHTML = `
            <div class="user-details">
                <p>Vārds: ${data.User.name}</p>
                <p>Uzvārds: ${data.User.lastName}</p>
                <p>Epasts: ${data.User.email}</p>
                <p>Tālrunis: ${data.User.phone}</p>
                <p>Lojalitāte: ${data.User.loyalty}</p>
            </div>
        `;
    });

    fetch(`/api/bookings/user/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(bookings => {
        const bookingsHtml = bookings.map(booking => `
            <div class="reservation">
                <p>Rezervācijas ID: ${booking._id}</p>
                <p>Mašīna: ${booking.car.make} ${booking.car.model}</p>
                <p>Rezervēšanas datums: ${new Date(booking.reservationDate).toLocaleDateString()}</p>
                <p>Rezervācijas sākums: ${new Date(booking.rentalStartDate).toLocaleDateString()}</p>
                <p>Rezervācijas beigas: ${new Date(booking.rentalEndDate).toLocaleDateString()}</p>
                <p>Pilnā summa: ${booking.totalPrice}</p>
                <p>Status: ${booking.status}</p>
                <button class="payment-button" data-booking-id="${booking._id}">Rādīt maksājumu</button>
            </div>
        `).join('');
        document.getElementById('user-bookings').innerHTML = bookingsHtml;

        document.querySelectorAll('.payment-button').forEach(button => {
            button.addEventListener('click', event => {
                const bookingId = event.currentTarget.getAttribute('data-booking-id');
                getPayment(bookingId);
            });
        });
    });
}