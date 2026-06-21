import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import MainLayout from "./layouts/MainLayout";
import CampaignsPage from "./pages/Campaigns";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/campaigns" element={<CampaignsPage />} />
      </Route>
    </Routes>
  );
}

export default App;