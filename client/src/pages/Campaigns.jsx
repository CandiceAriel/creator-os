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
import SearchFilters from '../components/SearchFilters';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import NewCampaignForm from '../components/NewCampaignForm';
import { cn } from "../lib/utils"

function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
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

  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className='flex justify-between'>
        <h1 className="text-2xl font-bold mb-4 font-sans text-foreground">Campaigns <br/> <span className='font-normal text-base text-foreground/50'>Manage brand partnerships and campaigns</span></h1>
        <Button 
          label="New Campaign" 
          icon={Plus} 
          onClick={() => setIsAddOpen(true)} 
        />
      </div>
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6'>
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
      <SearchFilters 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onFilterChange={setStatusFilter}
        placeholder="Search campaigns..."
      />
      {/* Campaigns List */}
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-max gap-4 mt-6'>
        {isLoading ? (
          <div className="col-span-full text-center py-10 text-muted-foreground animate-pulse">
            Loading campaigns...
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            No campaigns found matching your criteria.
          </div>
        ) : (
          // ✅ FIX: Mapping over filteredCampaigns instead of campaigns array
          filteredCampaigns.map(c => (
            <Card key={c.id} className="py-4 bg-white hover:shadow-md transition-shadow grid grid-rows-[subgrid] row-span-3 gap-0">
              {/* Row 1/3: Header Block */}
              <CardHeader className="pb-3">
                <div className="text-left">
                  {/* Campaign Title */}
                  <CardTitle className="text-lg font-bold tracking-tight text-foreground truncate max-w-[200px]">
                    {c.title}
                  </CardTitle>
                  
                  {/* Status Badge */}
                  <CardDescription className="mt-2">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider",
                      c.status === 'active' && "bg-emerald-500/10 text-emerald-600",
                      c.status === 'negotiating' && "bg-amber-500/10 text-amber-500",
                      c.status === 'completed' && "bg-purple-500/10 text-purple-400"
                    )}>
                      {c.status}
                    </span>
                  </CardDescription>
                </div>
              </CardHeader>

              {/* Row 2/3: Spacer block matching brand layout */}
              <div className="h-4" />

              {/* Row 3/3: Date Footer Block */}
              <div className="w-full flex flex-col justify-end">
                <div className="border-t border-border/60 mx-4" />
                <CardContent className="flex justify-between text-sm text-muted-foreground pt-3 px-4">
                  <span className="text-xs text-muted-foreground/50">Start Date</span>
                  <span className="font-semibold text-foreground text-xs">
                    {c.start_date
                      ? new Date(c.start_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })
                      : 'N/A'
                    }
                  </span>
                </CardContent>
              </div>
            </Card>
          ))
        )}
      </div>
      
       <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Campaign</DialogTitle>
          </DialogHeader>
          <NewCampaignForm
            onSuccess={(created) => {
              setCampaigns((prev) => [created, ...prev]);
              setIsAddOpen(false);
            }}
            onCancel={() => setIsAddOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CampaignsPage