const form = document.getElementById("newUserForm");

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
      password: formData.password,
      role: formData.role,
      email: formData.email,
      name: formData.name,
      lastName: formData.surname,
      phone: formData.phone,
      licenseNr: formData.license,
      loyalty: formData.loyalty
    };
    console.log('Form data:', data);
    fetch('/api/auth/register', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.ok) {
        console.log('User added successfully');
      } else {
        console.error('Error adding user:', response.status);
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
});