import { navigate } from './handleNavigation.js';

export function loadCarList() {
    fetch('/api/cars')
        .then(response => response.json())
        .then(data => {
            const carList = document.getElementById('car-list');
            carList.innerHTML = '';
            data.forEach(car => {
                let payload = { cardId: car._id };
                const carElement = document.createElement('div');
                carElement.className = 'car-item';
                const imageElements = car.images.map(imageUrl => `<img src="${imageUrl}" alt="${car.make} ${car.model}" class="car-image">`).join('');
                carElement.innerHTML = `
                    <h2>${car.make} ${car.model}</h2>
                    <div class="car-images">
                        ${imageElements}
                    </div>
                    <p>ID: ${car._id}</p>
                    <p>Cena dienā: $${car.pricePerDay}</p>
                    <button onclick="navigate('booking', ${JSON.stringify(payload).replace(/"/g, '&quot;')});">Rezervēt auto</button>
                `;
                carList.appendChild(carElement);
            });
        })
        .catch(err => console.error('Error loading cars:', err));
}
