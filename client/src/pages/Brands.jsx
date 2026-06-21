import { useEffect, useState } from 'react';
import { getBrands } from '../api/brands';
import { Plus, User, Mail } from 'lucide-react';
import Button from '../components/ui/button';
import SearchFilters from '../components/SearchFilters';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "../components/ui/card";
import { cn } from "../lib/utils";

function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  useEffect(() => {
    getBrands()
      .then((data) => {
        setBrands(data || []);
      })
      .catch((err) => console.error("Failed to load brands:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredBrands = brands.filter(b => {
    const matchesSearch = 
      (b.name?.toLowerCase().includes(searchQuery.toLowerCase())) || 
      (b.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = 
      statusFilter === "all" || 
      b.status?.toLowerCase() === statusFilter.toLowerCase();
      
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      {/* Header section */}
      <div className='flex justify-between items-center mb-6'>
        <h1 className="text-2xl font-bold font-sans text-foreground">
          Brands <br/> 
          <span className='font-normal text-base text-foreground/50'>Manage your corporate clients and prospects</span>
        </h1>
        <Button 
          label="New Brand" 
          icon={Plus} 
        />
      </div>

      {/* Search and Filter Inputs */}
      <SearchFilters 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onFilterChange={setStatusFilter}
        placeholder="Search brands or contacts..."
      />

      {/* 1. MASTER GRID: We instruct this grid container to auto-generate rows 
        that span 3 subgrid tracks per card item.
      */}
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-max gap-4 mt-6'>
        {isLoading ? (
          <div className="col-span-full text-center py-10 text-muted-foreground animate-pulse">
            Loading brands...
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            No brands found matching your criteria.
          </div>
        ) : (
          filteredBrands.map(b => (
            <Card 
              key={b.id} 
              className="py-4 bg-white hover:shadow-md transition-shadow flex flex-col h-full gap-0"
            >
              {/* Row 1/3: Header (Title & Status) */}
              <CardHeader className="pb-3">
                <div className="text-left">
                  <CardTitle className="text-lg font-bold tracking-tight text-foreground truncate max-w-[220px]">
                    {b.name}
                  </CardTitle>
                  
                  <CardDescription className="mt-2">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider",
                      b.status === 'active' && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                      b.status === 'prospect' && "bg-amber-500/10 text-amber-500",
                      b.status === 'negotiating' && "bg-blue-500/10 text-blue-500",
                      (b.status === 'inactive' || !b.status) && "bg-slate-500/10 text-slate-500"
                    )}>
                      {b.status || 'prospect'}
                    </span>
                  </CardDescription>
                </div>
              </CardHeader>

              {/* Row 2/3: Contact Info */}
              <CardContent className="flex flex-col gap-2.5 text-xs text-muted-foreground pb-4 justify-start flex-1">
                {b.contact_name ? (
                  <div className="flex items-center gap-1.5 text-foreground/80 truncate">
                    <User className="size-3.5 shrink-0 text-muted-foreground/70" />
                    <span className="truncate">{b.contact_name}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-muted-foreground/40 italic">
                    <User className="size-3.5 shrink-0" />
                    <span>No contact name</span>
                  </div>
                )}

                {b.contact_email ? (
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="size-3.5 shrink-0 text-muted-foreground/70" />
                    <span className="truncate text-muted-foreground">{b.contact_email}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-muted-foreground/40 italic">
                    <Mail className="size-3.5 shrink-0" />
                    <span>No email provided</span>
                  </div>
                )}

                <div className="px-4 pt-3 text-center border-t border-divider">
                  {b.notes ? (
                    <p className="text-[11px] text-muted-foreground/60 line-clamp-2 leading-normal">
                      {b.notes}
                    </p>
                  ) : (
                    <p className="text-[11px] text-muted-foreground/30 italic line-clamp-2 leading-normal">
                      No additional notes
                    </p>
                  )}
                </div>
              </CardContent>

            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default BrandsPage;