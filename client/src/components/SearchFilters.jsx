import { Search, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from './ui/dropdown-menu';

function SearchFilters({ 
  searchQuery, 
  onSearchChange, 
  statusFilter, 
  onFilterChange,
  placeholder = "Search...",
  options = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'negotiating', label: 'Negotiating' },
    { value: 'completed', label: 'Completed' }
  ]
}) {
  // Find current active label text for display inside the trigger button box
  const activeLabel = options.find(opt => opt.value === statusFilter)?.label || 'All';

  return (
    <div className="flex items-center gap-3 w-full mb-6">
      {/* Search Input Container */}
      <div className="relative flex-1">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-text-muted">
          <Search className="size-4" />
        </span>
        <input 
          type="text"
          placeholder={placeholder} 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white text-text-primary placeholder-text-muted text-sm pl-10 pr-4 py-2.5 rounded-xl border border-input-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-sm"
        />
      </div>

      {/* Modern Radix Dropdown Tool Component */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center justify-between gap-2 bg-white text-text-primary text-sm px-4 py-2.5 rounded-xl border border-input-border hover:bg-list-item-hover transition-all cursor-pointer min-w-40 shadow-sm font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20">
            <span>{activeLabel}</span>
            <ChevronDown className="size-4 text-text-muted transition-transform duration-200" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuRadioGroup value={statusFilter} onValueChange={onFilterChange}>
            {options.map((opt) => (
              <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                {opt.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default SearchFilters;