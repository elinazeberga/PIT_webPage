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

function navigate(page, param = null) {
  fetch(`/api/admin/page/${page}/${param}`)
  .then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
    })
    .then(response => {
      const [htmlContent, scriptContent] = response;
        content.innerHTML = htmlContent;

        const scriptElement = document.createElement('script');
        scriptElement.type = 'text/javascript';
        scriptElement.innerHTML = scriptContent;
        document.head.appendChild(scriptElement);
    })
    .catch(error => {
      console.error('Error fetching page data:', error);
      content.innerHTML = '<p>Failed to load page.</p>';
    });
};

