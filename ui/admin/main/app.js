const adminNavigationPane = document.getElementById('navigation');
const content = document.getElementById('content');

// Authenticate user
// After auth fetch content
// Otherwise kick out

adminNavigationPane.innerHTML = `
  <ul>
    <li><a href="#" onclick="navigate('home')">Home</a></li>
    <li><a href="#" onclick="navigate('catalog')">Cars</a></li>
    <li><a href="#" onclick="navigate('reservationlist')">Reservations</a></li>
    <li><a href="#" onclick="navigate('userlist')">Users</a></li>
    <li><a href="#" onclick="signout()">Sign out</a></li>
  </ul>`;

function navigate(page) {
  fetch(`/api/admin/page/${page}`)
  .then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.text();
    })
    .then(response => {
        content.innerHTML = response;
    })
    .catch(error => {
      console.error('Error fetching page data:', error);
      content.innerHTML = '<p>Failed to load page.</p>';
    });
};

