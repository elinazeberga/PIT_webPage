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
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const data = {
      id,
      password: formData.password,
      role: formData.role,
      email: formData.email,
      name: formData.name,
      lastName: formData.surname,
      phone: formData.phone,
      licenseNr: formData.license,
      loyalty: formData.loyalty
    };
    if (id == 'new') {
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
          window.location.href = "../";
        } else {
          console.error('Error adding user:', response.status);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    } else {
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => value !== "")
      );
      fetch('/api/auth/alter', {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filteredData)
      })
      .then(response => {
        if (response.ok) {
          console.log('User edited successfully');
          window.location.href = "../";
        } else {
          console.error('Error adding user:', response.status);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
});