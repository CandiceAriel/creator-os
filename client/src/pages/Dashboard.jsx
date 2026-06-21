import { useEffect, useState, useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
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
import {Skeleton} from '../components/ui/skeleton'

//APIs Import
import { getCampaigns } from '../api/campaigns';
import { getPayments } from '../api/payment';

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

  // 2. Fetching is the ONLY thing happening inside useEffect
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

  // 3. Calculation lives OUTSIDE useEffect using useMemo
  // This code only runs when the 'payments' or 'campaigns' arrays change!
  const metrics = useMemo(() => {
    const totalAmount = payments
      .filter(p => p.status === 'completed' || p.status === 'paid')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    const pendingAmount = payments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    const activeCampaigns = campaigns
      .filter(c => c.status === 'active').length;

    return { totalAmount, pendingAmount, activeCampaigns };
  }, [payments, campaigns]); 

  //Earnings Chart
  const earningsChart = useMemo(() => {
    // 1. Filter for valid payments with dates
    const completedPayments = payments.filter(
      (p) => (p.status === 'completed' || p.status === 'paid') && p.created_at
    );

    // 2. Group earnings by date using an accumulator object/dictionary
    const dateMap = completedPayments.reduce((acc, p) => {
      // Format the date string (e.g., "2026-06-21" or "Jun 21")
      const dateLabel = new Date(p.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      acc[dateLabel] = (acc[dateLabel] || 0) + Number(p.amount || 0);
      return acc;
    }, {});

    // 3. Convert the dictionary back to an ordered array for Recharts
    return Object.entries(dateMap).map(([date, earnings]) => ({
      date,
      earnings,
    }));
  }, [payments]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 font-sans text-foreground">Dashboard <br/> <span className='font-normal text-base text-foreground/50'>Track your growth, earnings, and campaigns</span></h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 mb-6'>
        {/* Active Cards */}
        <Card className="py-5">
          <CardHeader className="flex flex-row items-center gap-4 px-5 py-0 grid-none">
            <div className="p-3 bg-violet-500/10 text-accent rounded-xl flex items-center justify-center shrink-0">
              <CircleDollarSign className="size-5" />
            </div>
            <div className="text-left">
              <CardDescription className="text-muted-foreground uppercase text-[11px] tracking-wider font-bold leading-none">
                Total Earnings
              </CardDescription>
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground mt-1.5 leading-none">
                {isLoading ? 
                  <span className="text-sm opacity-50 animate-pulse">...</span>
                 : 
                  formatCurrency(metrics.totalAmount)
                }
              </CardTitle>
            </div>
          </CardHeader>
        </Card>
        {/* Pending Payments Card */}
        <Card className="py-5">
          <CardHeader className="flex flex-row items-center gap-4 px-5 py-0 grid-none">
            <div className="p-3 bg-violet-500/10 text-accent rounded-xl flex items-center justify-center shrink-0">
              <Clock className="size-5" />
            </div>
            <div className="text-left">
              <CardDescription className="text-muted-foreground uppercase text-[11px] tracking-wider font-bold leading-none">
                Pending Payments
              </CardDescription>
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground mt-1.5 leading-none">
                {isLoading ? 
                  <span className="text-sm opacity-50 animate-pulse">...</span>
                 : 
                  formatCurrency(metrics.pendingAmount)
                }
              </CardTitle>
            </div>
          </CardHeader>
        </Card>
        {/* Active Campaigns Card */}
        <Card className="py-5">
          <CardHeader className="flex flex-row items-center gap-4 px-5 py-0 grid-none">
            <div className="p-3 bg-violet-500/10 text-accent rounded-xl flex items-center justify-center shrink-0">
              <Megaphone className="size-5" />
            </div>
            <div className="text-left">
              <CardDescription className="text-muted-foreground uppercase text-[11px] tracking-wider font-bold leading-none">
                Active Campaigns
              </CardDescription>
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground mt-1.5 leading-none">
                {isLoading ? 
                  <span className="text-sm opacity-50 animate-pulse">...</span>
                 : 
                  metrics.activeCampaigns
                }
              </CardTitle>
            </div>
          </CardHeader>
        </Card>
      </div>
      <div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 bg-card-bg text-text-primary border-border/50 flex flex-col gap-6 rounded-xl border shadow-sm p-5'>
          {isLoading ? (
            <Skeleton className="h-[200px] w-full bg-slate-100" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={earningsChart ?? []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                {/* Changed grid lines to subtle slate gray */}
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
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
      <div className='bg-card-bg text-card-foreground border-border/50 flex flex-col gap-6 rounded-xl border shadow-sm my-6 p-5'>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-16 w-full bg-slate-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : campaigns.length === 0 ? (
          /* Empty State */
          <p className="text-sm text-slate-400 text-center py-6">No campaigns found.</p>
        ) : (
          /* The Campaign List Mapping */
          <div className="flex flex-col gap-3">
            {campaigns.map((campaign) => (
              <div 
                key={campaign.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-100 rounded-xl bg-secondary hover:bg-slate-50/50 transition-colors gap-3"
              >
                {/* Left Side: Info */}
                <div className="flex flex-col gap-1">
                  <h4 className="text-base font-semibold text-slate-900 leading-tight">
                    {campaign.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>Budget:</span>
                    <span className="font-medium text-slate-600">
                      {campaign.budget 
                        ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(campaign.budget) 
                        : 'N/A'}
                    </span>
                    {campaign.start_date && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span>Starts: {new Date(campaign.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Right Side: Status Badge */}
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
  )
}

export default Dashboard