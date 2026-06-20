import { useEffect, useState } from 'react';
import { getCampaigns } from '../api/campaigns';

function Dashboard() {
  const [campaigns, setCampaigns] = useState([]);
  
  useEffect(() => {
    getCampaigns().then(setCampaigns);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Campaigns</h1>
      {campaigns.map(c => (
        <div key={c.id} className="border-b py-2">{c.title}</div>
      ))}
    </div>
  )
}

export default Dashboard