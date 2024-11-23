const API_ENDPOINTS = {
  CREATE: '/api/cars/create',
  UPDATE: '/api/cars/alter',
  DELETE: '/api/cars/delete'
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

const formatVehicleData = (formData, id) => {
  const baseData = {
    id,
    make: formData.make,
    model: formData.model,
    registrationNumber: formData.regNr,
    type: formData.type,
    fuelType: formData.fuelType,
    gearboxType: formData.gearboxType,
    year: formData.year,
    pricePerDay: formData.price,
    status: formData.status, 
    images: formData.image.split(','),
    notes: formData.notes 
  };

  return id === 'new' 
    ? baseData 
    : Object.fromEntries(Object.entries(baseData).filter(([_, value]) => value !== ""));
};

async function createVehicle(data) {
  try {
    const response = await fetch(API_ENDPOINTS.CREATE, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    await handleApiResponse(response);
  } catch (error) {
    console.error('Error creating vehicle:', error);
    throw error;
  }
}

async function updateVehicle(data) {
  try {
    const response = await fetch(API_ENDPOINTS.UPDATE, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    await handleApiResponse(response);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    throw error;
  }
}

async function deleteVehicle(id) {
  try {
    const response = await fetch(API_ENDPOINTS.DELETE, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ id: id })
    });
    await handleApiResponse(response);
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    throw error;
  }
}

const form = document.getElementById("newVehicleForm");

form.addEventListener('submit', async function(event) {
  event.preventDefault();
  
  try {
    const formData = Object.fromEntries(new FormData(form));

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    const vehicleData = formatVehicleData(formData, id);
    
    if (id === 'new') {
      await createVehicle(vehicleData);
    } else {
      await updateVehicle(vehicleData);
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
    await deleteVehicle(id);
  } catch (error) {
    console.error('Delete error:', error);
    alert('Failed to delete vehicle');
  }
};