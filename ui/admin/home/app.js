const adminNavigationPane = document.getElementById('navigation');
const content = document.getElementById('content');

// Authenticate user
// After auth fetch content
// Otherwise kick out

function getPageInfo() {
  const pathname = window.location.pathname;
  const pathSegments = pathname.split('/').filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];

  const urlParams = new URLSearchParams(window.location.search);
  const pageParams = urlParams.get('id');

  return [lastSegment, pageParams];
}

function fetchContent(pageInfo) {
  fetch(`/api/admin/page/${pageInfo[0]}/${pageInfo[1]}`, {
    method: "get",
    headers: {
      "Authorization": `Bearer ${sessionStorage.getItem('jwtToken')}`
    }
  })
  .then(response => {
    if (response.status === 401) {
      window.location.href = '/admin';
    }
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
    })
    .then(response => {
      const [navigationPane, htmlContent, scriptContent] = response;
        adminNavigationPane.innerHTML = navigationPane;
        content.innerHTML = htmlContent;
        if (scriptContent != undefined) {
          const scriptElement = document.createElement('script');
          scriptElement.type = 'text/javascript';
          scriptElement.id = `${pageInfo[0]}-script`;
          scriptElement.innerHTML = scriptContent;
          document.head.appendChild(scriptElement);
        }
    })
    .catch(error => {
      console.error('Error fetching page data:', error);
      content.innerHTML = '<p>Failed to load page.</p>';
    });
};

function signout() {
  sessionStorage.removeItem('jwtToken');
  window.location.href = '/admin';
}

const pageInfo = getPageInfo();
fetchContent(pageInfo);