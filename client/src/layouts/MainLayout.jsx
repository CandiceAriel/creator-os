
import { Outlet } from "react-router-dom";
import Sidebar from "../components/ui/sidebar";

export default function MainLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-background">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
        
      </main>
    </div>
  );
}