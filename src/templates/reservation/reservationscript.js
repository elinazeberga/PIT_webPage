const API_ENDPOINTS = {
  CREATE: '/api/bookings/create',
  UPDATE: '/api/bookings/alter',
  DELETE: '/api/bookings/delete'
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

const formatReservationData = (formData, id) => {
  const baseData = {
    id,
    userId: formData.renter,
    carId: formData.vehicle,
    rentalStartDate: new Date(formData.reservationStart + 'Z'),
    rentalEndDate: new Date(formData.reservationEnd + 'Z'),
    status: formData.status
  };

  return id === 'new' 
    ? baseData 
    : Object.fromEntries(Object.entries(baseData).filter(([_, value]) => value !== ""));
};

async function createReservation(data) {
  try {
    const response = await fetch(API_ENDPOINTS.CREATE, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    await handleApiResponse(response);
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
}

async function updateReservation(data) {
  try {
    const response = await fetch(API_ENDPOINTS.UPDATE, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    await handleApiResponse(response);
  } catch (error) {
    console.error('Error updating reservation:', error);
    throw error;
  }
}

async function deleteReservation(id) {
  try {
    const response = await fetch(API_ENDPOINTS.DELETE, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ id: id })
    });
    await handleApiResponse(response);
  } catch (error) {
    console.error('Error deleting reservation:', error);
    throw error;
  }
}

const form = document.getElementById("newReservationForm");

form.addEventListener('submit', async function(event) {
  event.preventDefault();
  
  try {
    const formData = Object.fromEntries(new FormData(form));

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    const reservationData = formatReservationData(formData, id);
    
    if (id === 'new') {
      await createReservation(reservationData);
    } else {
      await updateReservation(reservationData);
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
    await deleteReservation(id);
  } catch (error) {
    console.error('Delete error:', error);
    alert('Failed to delete reservation');
  }
};