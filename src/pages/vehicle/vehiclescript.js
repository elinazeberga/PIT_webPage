const form = document.getElementById("newVehicleForm");

form.addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = {};
    const formElements = new FormData(form);
    formElements.forEach((value, key) => {
        formData[key] = value;
    });
    console.log('Form data:', formData);
    const data = {
      make: formData.make,
      model: formData.model,
      registrationNumber: formData.regNr,
      type: formData.type,
      fuelType: formData.fuelType,
      gearboxType: formData.gearboxType,
      year: formData.year,
      pricePerDay: formData.price,
      status: formData.status, 
      images: formData.image ? formData.image.split(',') : [],
      notes: formData.notes 
    };
    fetch('/api/cars', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.ok) {
        console.log('Car added successfully');
      } else {
        console.error('Error adding car:', response.status);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
});