const form = document.getElementById("newReservationForm");

form.addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = {};
    const formElements = new FormData(form);
    formElements.forEach((value, key) => {
        formData[key] = value;
    });
    if (formData.password !== formData.passwordConfirmation) {
        alert("Passwords do not match");
        throw new Error("Password mismatch");
    }
    const data = {
        userId: formData.renter,
        carId: formData.vehicle,
        rentalStartDate: formData.reservationStart,
        rentalEndDate: formData.reservationEnd,
        status: formData.status
    };
    fetch('/api/bookings', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.ok) {
        console.log('Reservation added successfully');
        window.location.href = "../";
      } else {
        console.error('Error adding reservation:', response.status);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
});