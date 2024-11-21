const form = document.getElementById("newReservationForm");

form.addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = {};
    const formElements = new FormData(form);
    formElements.forEach((value, key) => {
        formData[key] = value;
    });
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (formData.password !== formData.passwordConfirmation) {
        alert("Passwords do not match");
        throw new Error("Password mismatch");
    }
    const data = {
        id,
        userId: formData.renter,
        carId: formData.vehicle,
        rentalStartDate: new Date(formData.reservationStart + 'Z'),
        rentalEndDate: new Date(formData.reservationEnd + 'Z'),
        status: formData.status
    };
    if (id == 'new') {
      fetch('/api/bookings', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${sessionStorage.getItem('jwtToken')}`
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
    } else {
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => value !== "")
      );
      fetch('/api/bookings/alter', {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${sessionStorage.getItem('jwtToken')}`
        },
        body: JSON.stringify(filteredData)
      })
      .then(response => {
        if (response.ok) {
          console.log('Reservation edited successfully');
          window.location.href = "../";
        } else {
          console.error('Error adding reservation:', response.status);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
});