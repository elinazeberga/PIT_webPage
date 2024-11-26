const content = document.getElementById('content');

function navigate(page) {
  switch(page) {
    case 'home':
      renderHome();
      break;
    case 'car-catalog':
      renderCarCatalog();
      break;
    case 'login':
      renderLogin();
      break;
    case 'register':
      renderRegister();
      break;
    default:
      renderHome();
  }
}

function renderHome() {
  content.innerHTML = `
    <div class="main-page">
        <section class="main-page__section1">
            <div class="main-page__section1__content">
                <h2 class="main-page__section1__content--heading1">Plašs automašīnu izīrēšanas klāsts un patīkamas cenas</h2>
                <h2 class="main-page__section1__content--heading2">patīkamas cenas</h2>
                <button class="main-page__section1__content--button" type="button">
                    <p class="main-page__section1__content--button-text">Izvēlies automašīnu</p>
                </button>
            </div>
            <div class="main-page__section1__content">
                <img class="main-page__section1__content--image" src="assets/main-page-car.png" alt="#">
            </div>
        </section>
        <section class="main-page__section2">
            <div class="main-page__section2__content">
                <img class="main-page__section2__content--image" src="assets/main-page-car2.png" alt="#">
            </div>
            <div class="main-page__section2__content main-page__section2__content--text">
                <h2 class="main-page__section2__content--heading1">Par mums</h2>
                <h3 class="main-page__section2__content--heading2">Esam automašīnu izīrēšanas firma, kas  nodrošina lietotājiem ērtu un ātru automašīnu nomas pakalpojumu tiešsaistē. Šī firma piedāva plašu automašīnu klāstu, lietotāji var apskatīt automašīnu katalogu, izvēlēties transportlīdzekli un veikt rezervāciju.  Papildus tiek nodrošināts 24/7 klientu atbalsts, kas integrēts ar čatbotu, un iespēja saņemt atlaides ilgtermiņa nomām.</h3>
            </div>
        </section>
    </div>
  `;
}

function renderCarCatalog() {
  fetch('/api/cars')
    .then(response => response.json())
    .then(cars => {
      let carHtml = cars.map(car => `
        <div class="car-card">
          <h3>${car.make} ${car.model}</h3>
          <p>Year: ${car.year}</p>
          <p>Price per day: $${car.pricePerDay}</p>
        </div>
      `).join('');

      content.innerHTML = `
        <h1>Car Catalog</h1>
        ${carHtml}
      `;
    })
    .catch(error => {
      console.error('Error fetching car data:', error);
      content.innerHTML = '<p>Failed to load car catalog.</p>';
    });
}

function renderLogin() {
  content.innerHTML = `
    <h1>Login</h1>
    <form onsubmit="handleLogin(event)">
      <input type="text" id="login-username" placeholder="Username" required>
      <input type="password" id="login-password" placeholder="Password" required>
      <button type="submit">Login</button>
    </form>
  `;
}

function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

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
        navigate('home');
      } else {
        alert('Login failed! Check your username and password.');
      }
    })
    .catch(error => {
      console.error('Error logging in:', error);
      alert('Login failed! An error occurred.');
    });
}

function renderRegister() {
  content.innerHTML = `
    <h1>Register</h1>
    <form onsubmit="handleRegister(event)">
      <input type="text" id="register-username" placeholder="Username" required>
      <input type="password" id="register-password" placeholder="Password" required>
      <button type="submit">Register</button>
    </form>
  `;
}

function handleRegister(event) {
  event.preventDefault();

  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;

  fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        alert('Registration successful!');
        navigate('login');
      } else {
        alert('Registration failed!');
      }
    })
    .catch(error => {
      console.error('Error registering:', error);
      alert('Registration failed! An error occurred.');
    });
}

// Initialize the home page
navigate('home');
