import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Megaphone, 
  LayoutDashboard, 
  ChevronLeft, 
  ChevronRight, 
  Building2 
} from 'lucide-react';

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/campaigns', label: 'Campaigns', icon: Megaphone },
    { path: '/brands', label: 'Brands', icon: Building2 },
  ];

  const isActive = (path) => 
    location.pathname === path 
      ? 'bg-sidebar-accent text-sidebar-primary' 
      : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-white';

  return (
    <div 
      className={`hidden lg:flex flex-col gap-6 bg-sidebar-bg p-4 border-r border-border h-screen transition-all duration-300 relative ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header Section */}
      <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} min-h-[40px]`}>
        {!isCollapsed && (
          <h2 className="text-xl font-bold text-foreground truncate defer-fade">
            Creator Suite
          </h2>
        )}
        
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg bg-border/50 hover:bg-border text-foreground transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-2">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const activeClass = isActive(link.path);
          
          return (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-all ${activeClass} text-foreground hover:bg-primary-hover hover:text-white group relative`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              
              {/* Hide text when collapsed */}
              <span className={`transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                {link.label}
              </span>

              {/* Optional: Tooltip on Hover when Collapsed */}
              {isCollapsed && (
                <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-foreground text-background text-sm invisible opacity-0 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 z-50 whitespace-nowrap">
                  {link.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default Sidebar;