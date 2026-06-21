import { useEffect, useState, useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { 
  Plus, 
  Megaphone, 
  Clock,
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
import { Skeleton } from '../components/ui/skeleton'

// APIs Import
import { getCampaigns } from '../api/campaigns';
import { getPayments } from '../api/payments';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount || 0);
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xl">
        <p className="text-xs text-slate-400 font-medium mb-0.5">{payload[0].payload.date}</p>
        <p className="text-sm font-bold text-purple-600">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

function Dashboard() {
  const [payments, setPayments] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRawData() {
      try {
        const [paymentsData, campaignsData] = await Promise.all([
          getPayments(),
          getCampaigns()
        ]);
        setPayments(Array.isArray(paymentsData) ? paymentsData : []);
        setCampaigns(Array.isArray(campaignsData) ? campaignsData : []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadRawData();
  }, []);

  const metrics = useMemo(() => {
    const totalAmount = payments
      .filter(p => p.status === 'completed' || p.status === 'paid')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    const pendingAmount = payments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    const activeCampaignsCount = campaigns
      .filter(c => c.status === 'active').length;

    return { totalAmount, pendingAmount, activeCampaignsCount };
  }, [payments, campaigns]); 

  const activeCampaignsList = useMemo(
    () => campaigns.filter(c => c.status === 'active'),
    [campaigns]
  );

  // Earnings Chart
  const earningsChart = useMemo(() => {
    const completedPayments = payments.filter(
      (p) => (p.status === 'completed' || p.status === 'paid') && p.due_date
    );

    const dateMap = completedPayments.reduce((acc, p) => {
      const dateLabel = new Date(p.due_date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      acc[dateLabel] = (acc[dateLabel] || 0) + Number(p.amount || 0);
      return acc;
    }, {});

    const chartData = Object.entries(dateMap).map(([date, earnings]) => ({
      date,
      earnings,
    }));

    // Fix: If there's only 1 item, inject a starting baseline so a line draws
    if (chartData.length === 1) {
      return [
        { date: "Start", earnings: 0 },
        ...chartData
      ];
    }

    return chartData;
  }, [payments]);



  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 font-sans text-foreground">
        Dashboard <br/> 
        <span className='font-normal text-base text-foreground/50'>Track your growth, earnings, and campaigns</span>
      </h1>
      
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 mb-6'>
        {/* Total Earnings */}
        <Card className="py-5">
          <CardHeader className="flex flex-row items-center gap-4 px-5 py-0 grid-none">
            <div className="p-3 bg-violet-500/10 text-purple-500 rounded-xl flex items-center justify-center shrink-0">
              <CircleDollarSign className="size-5" />
            </div>
            <div className="text-left">
              <CardDescription className="text-muted-foreground uppercase text-[11px] tracking-wider font-bold leading-none">
                Total Earnings
              </CardDescription>
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground mt-1.5 leading-none">
                {isLoading ? <span className="text-sm opacity-50 animate-pulse">...</span> : formatCurrency(metrics.totalAmount)}
              </CardTitle>
            </div>
          </CardHeader>
        </Card>

        {/* Pending Payments */}
        <Card className="py-5">
          <CardHeader className="flex flex-row items-center gap-4 px-5 py-0 grid-none">
            <div className="p-3 bg-violet-500/10 text-purple-500 rounded-xl flex items-center justify-center shrink-0">
              <Clock className="size-5" />
            </div>
            <div className="text-left">
              <CardDescription className="text-muted-foreground uppercase text-[11px] tracking-wider font-bold leading-none">
                Pending Payments
              </CardDescription>
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground mt-1.5 leading-none">
                {isLoading ? <span className="text-sm opacity-50 animate-pulse">...</span> : formatCurrency(metrics.pendingAmount)}
              </CardTitle>
            </div>
          </CardHeader>
        </Card>

        {/* Active Campaigns */}
        <Card className="py-5">
          <CardHeader className="flex flex-row items-center gap-4 px-5 py-0 grid-none">
            <div className="p-3 bg-violet-500/10 text-purple-500 rounded-xl flex items-center justify-center shrink-0">
              <Megaphone className="size-5" />
            </div>
            <div className="text-left">
              <CardDescription className="text-muted-foreground uppercase text-[11px] tracking-wider font-bold leading-none">
                Active Campaigns
              </CardDescription>
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground mt-1.5 leading-none">
                {isLoading ? <span className="text-sm opacity-50 animate-pulse">...</span> : metrics.activeCampaignsCount}
              </CardTitle>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Earnings Line Area Chart Component Section */}
      <div className="bg-white text-slate-900 border border-slate-200/80 rounded-xl shadow-sm p-5 mb-6">
        <div className="mb-4 text-left">
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Earnings Performance</h3>
          <p className="text-xs text-slate-400">Monthly progression of collected earnings data</p>
        </div>
        
        {/* FIX: Giving a distinct minimum display container height prevents ResponsiveContainer from collapsing to 0px */}
        <div className="w-full h-[260px] relative">
          {isLoading ? (
            <Skeleton className="h-full w-full bg-slate-100 rounded-lg absolute inset-0" />
          ) : earningsChart.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground italic border border-dashed rounded-xl">
              No performance data captured for this layout track.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(168, 85, 247, 0.15)', strokeWidth: 1.5 }} />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="#a855f7"
                  strokeWidth={2}
                  fill="url(#earningsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Campaigns Bottom Section */}
      <div className='bg-white text-slate-900 border border-slate-200/80 rounded-xl shadow-sm p-5'>
        <div className="mb-4 text-left">
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Recent Campaigns</h3>
          <p className="text-xs text-slate-400">Overview of current Campaigns</p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-16 w-full bg-slate-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No campaigns found.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {activeCampaignsList.map((campaign) => (
              <div 
                key={campaign.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors gap-3"
              >
                <div className="flex flex-col gap-1 text-left">
                  <h4 className="text-base font-semibold text-slate-900 leading-tight">
                    {campaign.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    {campaign.start_date && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span>Starts: {new Date(campaign.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border uppercase tracking-wider ${
                    campaign.status === 'active' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' 
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;