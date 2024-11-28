import { navigate } from './handleNavigation.js';

export function loadCarList() {
    fetch('/api/cars')
        .then(response => response.json())
        .then(data => {
            const carList = document.getElementById('car-list');
            carList.innerHTML = '';
            data.forEach(car => {
                let payload = { carId: car._id };
                const carElement = document.createElement('div');
                carElement.className = 'car__info';
                const imageElements = car.images.map(imageUrl => `<img src="${imageUrl}" alt="${car.make} ${car.model}" class="car__image-container__image">`).join('');
                carElement.innerHTML = `
                    <h2 class="car__name">${car.make} ${car.model}</h2>
                    <div class="car__image-container">
                        ${imageElements}
                    </div>
                    <p class="car__info--id">ID: ${car._id}</p>
                    <p class="car__info--price">Cena dienā: $${car.pricePerDay}</p>
                    <button class="car__reserveCarButton" onclick="navigate('booking', ${JSON.stringify(payload).replace(/"/g, '&quot;')});">Rezervēt auto</button>
                `;
                carList.appendChild(carElement);
            });
        })
        .catch(err => console.error('Error loading cars:', err));
}
