import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Megaphone, LayoutDashboard } from 'lucide-react';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/campaigns', label: 'Campaign', icon: Megaphone },
  ];

  const isActive = (path) => 
    location.pathname === path 
      ? 'bg-sidebar-accent text-sidebar-primary' 
      : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-white';

  return (
    <div className="hidden lg:flex w-64 bg-sidebar-bg p-6 flex-col gap-6 border-r border-border h-screen">
      <h2 className="text-xl font-bold text-foreground">Creator Suite</h2>
      <nav className="flex flex-col gap-2">
        {navLinks.map((link) => {
          const Icon = link.icon; // Capitalize to render as a component
          return (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`flex items-center gap-3 p-3 rounded-lg font-medium transition ${isActive(link.path)} text-foreground hover:bg-primary-hover hover:text-white`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default Sidebar;