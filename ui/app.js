function injectHTML(url, elementId, callback = null) {
  fetch(url)
    .then(response => response.text())
    .then(data => {
      document.getElementById(elementId).innerHTML = data;
      if (callback) callback();
    })
    .catch(err => console.error(`Error fetching ${url}:`, err));
}

document.addEventListener('DOMContentLoaded', () => {
  injectHTML('components/nav.html', 'nav-placeholder');
  injectHTML('components/footer.html', 'footer-placeholder');

  const initialPage = 'home';
  navigate(initialPage);

  checkLoginStatus();
});

function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  navigate('home');
  location.reload();
};

function checkLoginStatus() {
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

function navigate(page, payload = null) {
  injectHTML(`pages/${page}.html`, 'content', () => {
    if (page === 'car-list') {
      loadCarList();
    } else if (page === 'booking') {
      attachBookingFormHandler(payload);
    } else if (page === 'payment') {
      attachPaymentFormHandler(payload);
    } else if (page === 'login' || page === 'register') {
      attachFormHandlers();
    }
  });
}

function attachFormHandlers() {
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

function loadCarList() {
  fetch('/api/cars')
    .then(response => response.json())
    .then(data => {
      const carList = document.getElementById('car-list');
      carList.innerHTML = '';
      data.forEach(car => {
        let payload = {cardId: car._id};
        const carElement = document.createElement('div');
        carElement.className = 'car-item';
        carElement.innerHTML = `
          <h2>${car.make} ${car.model}</h2>
          <p>ID: ${car._id}</p>
          <p>Cena dienā: $${car.pricePerDay}</p>
          <button onclick="navigate('booking', ${JSON.stringify(payload).replace(/"/g, '&quot;')});">Rezervēt auto</button>
        `;
        carList.appendChild(carElement);
      });
    })
    .catch(err => console.error('Error loading cars:', err));
}

function attachBookingFormHandler(payload = null) {
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

function attachPaymentFormHandler(payload = null) {
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