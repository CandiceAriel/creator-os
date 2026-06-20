import { useEffect, useState } from 'react';
import { getCampaigns } from '../api/campaigns';
import { 
  Plus, 
  Megaphone, 
  Clock ,
  CheckCircle,
  CircleDollarSign 
} from 'lucide-react';
import Button from '../components/ui/button';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "../components/ui/card";

function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    getCampaigns()
      .then((data) => {
        setCampaigns(data || []);
      })
      .catch((err) => console.error("Failed to load campaigns:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // Compute calculated metrics dynamically based on statuses in your data array
  const activeCount = campaigns.filter(c => c.status?.toLowerCase() === 'active').length;
  const negotiatingCount = campaigns.filter(c => c.status?.toLowerCase() === 'negotiating').length;
  const completedCount = campaigns.filter(c => c.status?.toLowerCase() === 'completed').length;
  
  const totalBudget = campaigns.reduce((sum, c) => {
    const rate = parseFloat(String(c.rate || '0').replace(/[^0-9.-]+/g, ""));
    return sum + (isNaN(rate) ? 0 : rate);
  }, 0);

  return (
    <div className="p-6">
      <div className='flex justify-between'>
        <h1 className="text-2xl font-bold mb-4 font-sans text-foreground">Campaigns <br/> <span className='font-normal text-base text-foreground/50'>Manage brand partnerships and campaigns</span></h1>
        <Button 
          label="New Campaign" 
          icon={Plus} 
          // onClick={handleCreate} 
        />
      </div>
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6'>
        {/* Active Cards */}
        <Card className="py-5">
          <CardHeader className="flex flex-row items-center gap-4 px-5 py-0 grid-none">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
              <Megaphone className="size-5" />
            </div>
            <div className="text-left">
              <CardDescription className="text-muted-foreground uppercase text-[11px] tracking-wider font-bold leading-none">
                Active
              </CardDescription>
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground mt-1.5 leading-none">
                {isLoading ? <span className="text-sm opacity-50 animate-pulse">...</span> : activeCount}
              </CardTitle>
            </div>
          </CardHeader>
        </Card>

        {/* Negotiating Card */}
        <Card className="py-5">
          <CardHeader className="flex flex-row items-center gap-4 px-5 py-0 grid-none">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center shrink-0">
              <Clock className="size-5" />
            </div>
            <div className="text-left">
              <CardDescription className="text-muted-foreground uppercase text-[11px] tracking-wider font-bold leading-none">
                Negotiating
              </CardDescription>
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground mt-1.5 leading-none">
                {isLoading ? <span className="text-sm opacity-50 animate-pulse">...</span> : negotiatingCount}
              </CardTitle>
            </div>
          </CardHeader>
        </Card>

        {/* Completed Card */}
        <Card className="py-5">
          <CardHeader className="flex flex-row items-center gap-4 px-5 py-0 grid-none">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center shrink-0">
              <CheckCircle className="size-5" />
            </div>
            <div className="text-left">
              <CardDescription className="text-muted-foreground uppercase text-[11px] tracking-wider font-bold leading-none">
                Completed
              </CardDescription>
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground mt-1.5 leading-none">
                {isLoading ? <span className="text-sm opacity-50 animate-pulse">...</span> : completedCount}
              </CardTitle>
            </div>
          </CardHeader>
        </Card>

        {/* Total Budget Card */}
        <Card className="py-5">
          <CardHeader className="flex flex-row items-center gap-4 px-5 py-0 grid-none">
            <div className="p-3 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
              <CircleDollarSign className="size-5" />
            </div>
            <div className="text-left">
              <CardDescription className="text-muted-foreground uppercase text-[11px] tracking-wider font-bold leading-none">
                Total Budget
              </CardDescription>
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground mt-1.5 leading-none">
                {isLoading ? (
                  <span className="text-sm opacity-50 animate-pulse">...</span>
                ) : (
                  `$${totalBudget.toLocaleString()}`
                )}
              </CardTitle>
            </div>
          </CardHeader>
        </Card>
      </div>
      <input></input>
      {campaigns.map(c => (
        <div key={c.id} className="border-b py-2">{c.title}</div>
      ))}
    </div>
  )
}

export default CampaignsPage