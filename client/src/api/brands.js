const BASE = import.meta.env.VITE_API_URL;

export async function getBrands() {
  const res = await fetch(`${BASE}/api/brands`);
  return res.json();
}

// New POST function to send data from the Frontend/Forms to the Backend
export async function createPayment(data) {
  const res = await fetch(`${BASE}/api/brands`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to create payment');
  }

  return res.json(); // Returns the newly created payment row from the DB
}
