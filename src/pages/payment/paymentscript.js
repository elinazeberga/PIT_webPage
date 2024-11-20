const form = document.getElementById("newPaymentForm");

form.addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = {};
    const formElements = new FormData(form);
    formElements.forEach((value, key) => {
        formData[key] = value;
    });
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const data = {
      id,
      bookingId: formData.booking,
      amount: formData.amount,
      status: formData.status, 
    };
    console.log(data);
    if (id == 'new') {
      fetch('/api/payments', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        if (response.ok) {
          console.log('Payment added successfully');
          window.location.href = "../";
        } else {
          console.error('Error adding payment:', response.status);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
    else {
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => value !== "")
      );
      fetch('/api/payments/alter', {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filteredData)
      })
      .then(response => {
        if (response.ok) {
          console.log('Payment edited successfully');
          window.location.href = "../";
        } else {
          console.error('Error adding payment:', response.status);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
});