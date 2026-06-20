const BASE = import.meta.env.VITE_API_URL;

export async function getCampaigns() {
  const res = await fetch(`${BASE}/api/campaigns`);
  return res.json();
}

export async function createCampaign(data) {
  const res = await fetch(`${BASE}/api/campaigns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}