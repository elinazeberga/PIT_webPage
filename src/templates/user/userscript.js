const API_ENDPOINTS = {
  CREATE: '/api/auth/register',
  UPDATE: '/api/auth/alter',
  DELETE: '/api/auth/delete'
};

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`
});

const handleApiResponse = async (response) => {
  if (response.status === 200 || response.status === 201) {
    window.location.href = "../";
    return;
  }
  throw new Error(`Request failed with status ${response.status}`);
};

const formatUserData = (formData, id) => {
  const baseData = {
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

  return id === 'new' 
    ? baseData 
    : Object.fromEntries(Object.entries(baseData).filter(([_, value]) => value !== ""));
};

async function createUser(data) {
  try {
    const response = await fetch(API_ENDPOINTS.CREATE, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    await handleApiResponse(response);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

async function updateUser(data) {
  try {
    const response = await fetch(API_ENDPOINTS.UPDATE, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    await handleApiResponse(response);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

async function deleteUser(id) {
  try {
    const response = await fetch(API_ENDPOINTS.DELETE, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ id: id })
    });
    await handleApiResponse(response);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

const form = document.getElementById("newUserForm");

form.addEventListener('submit', async function(event) {
  event.preventDefault();
  
  try {
    const formData = Object.fromEntries(new FormData(form));

    if (formData.password || formData.passwordConfirmation) {
      if (formData.password !== formData.passwordConfirmation) {
        throw new Error("Passwords do not match");
      }
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    const userData = formatUserData(formData, id);
    
    if (id === 'new') {
      await createUser(userData);
    } else {
      await updateUser(userData);
    }
  } catch (error) {
    console.error('Form submission error:', error);
    alert(error.message || 'An error occurred while processing your request');
  }
});

async function deleteEntry() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    await deleteUser(id);
  } catch (error) {
    console.error('Delete error:', error);
    alert('Failed to delete user');
  }
};