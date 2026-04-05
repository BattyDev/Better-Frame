import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './stores/authStore';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Builder from './pages/Builder';
import WeaponBuilder from './pages/WeaponBuilder';
import EquipmentBuilder from './pages/EquipmentBuilder';

const EQUIPMENT_CATEGORIES = new Set(['archwing', 'companion', 'companion-weapon', 'necramech', 'parazon']);

function BuilderRouter() {
  const { category } = useParams<{ category: string }>();
  if (category && EQUIPMENT_CATEGORIES.has(category.toLowerCase())) {
    return <EquipmentBuilder />;
  }
  return <WeaponBuilder />;
}
import Loadout from './pages/Loadout';
import Browse from './pages/Browse';
import Profile from './pages/Profile';
import BuildPage from './pages/BuildPage';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

const queryClient = new QueryClient();

function AppContent() {
  const initialize = useAuthStore((s) => s.initialize);
  const initialized = useAuthStore((s) => s.initialized);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-wf-bg-dark">
        <div className="text-wf-gold text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/builder/:category" element={<BuilderRouter />} />
        <Route path="/loadout" element={<Loadout />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/build/:id" element={<BuildPage />} />
        <Route path="/user/:username" element={<UserProfile />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
