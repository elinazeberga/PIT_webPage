const API_ENDPOINTS = {
  CREATE: '/api/payments/create',
  UPDATE: '/api/payments/alter',
  DELETE: '/api/payments/delete'
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

const formatPaymentData = (formData, id) => {
  const baseData = {
    id,
    bookingId: formData.booking,
    amount: formData.amount,
    status: formData.status, 
  };

  return id === 'new' 
    ? baseData 
    : Object.fromEntries(Object.entries(baseData).filter(([_, value]) => value !== ""));
};

async function createPayment(data) {
  try {
    const response = await fetch(API_ENDPOINTS.CREATE, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    await handleApiResponse(response);
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
}

async function updatePayment(data) {
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

async function deletePayment(id) {
  try {
    const response = await fetch(API_ENDPOINTS.DELETE, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ id: id })
    });
    await handleApiResponse(response);
  } catch (error) {
    console.error('Error deleting payment:', error);
    throw error;
  }
}

const form = document.getElementById("newPaymentForm");

form.addEventListener('submit', async function(event) {
  event.preventDefault();
  
  try {
    const formData = Object.fromEntries(new FormData(form));

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    const paymentData = formatPaymentData(formData, id);
    
    if (id === 'new') {
      await createPayment(paymentData);
    } else {
      await updatePayment(paymentData);
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
    await deletePayment(id);
  } catch (error) {
    console.error('Delete error:', error);
    alert('Failed to delete payment');
  }
};