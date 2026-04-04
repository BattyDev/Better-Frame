import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-wf-bg-dark">
      <Navbar />
      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto">
        <Outlet />
      </main>
      <footer className="border-t border-wf-border py-4 px-4 text-center text-xs text-wf-text-muted">
        Better Frame is not affiliated with Digital Extremes or Warframe.
      </footer>
    </div>
  );
}
