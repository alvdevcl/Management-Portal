import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { EventLog } from './components/EventLog';
import { useThemeStore } from './store/theme';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Catalogs } from './pages/Catalogs';
import { Resources } from './pages/Resources';
import { ResourceTypeList } from './components/ResourceTypeList';
import { Environments } from './pages/Environments';
import { Settings } from './pages/Settings';
import { Documentation } from './pages/Documentation';

const queryClient = new QueryClient();

export default function App() {
  const { theme } = useThemeStore();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className={theme}>
          <div className="min-h-screen bg-background">
            <Sidebar />
            <div className="lg:ml-64 min-h-screen">
              <Header />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/catalogs" element={<Catalogs />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/resources/list" element={<ResourceTypeList />} />
                  <Route path="/environments" element={<Environments />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/docs" element={<Documentation />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <EventLog />
            </div>
          </div>
        </div>
      </Router>
    </QueryClientProvider>
  );
}