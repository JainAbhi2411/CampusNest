import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, RequireAuth } from 'miaoda-auth-react';
import { Toaster } from 'sonner';
import { supabase } from '@/db/supabase';
import { ComparisonProvider } from '@/contexts/ComparisonContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ComparisonBar from '@/components/comparison/ComparisonBar';
import ChatBot from '@/components/ChatBot';
import routes from './routes';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isCompareRoute = location.pathname === '/compare';
  
  // Handle automatic redirect after registration/login
  useAuthRedirect();

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Header />}
      <main className="flex-grow">
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.element}
            />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && !isCompareRoute && <ComparisonBar />}
      {!isAdminRoute && <ChatBot />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider client={supabase}>
        <Toaster position="top-center" richColors />
        <LocationProvider>
          <ComparisonProvider>
            <RequireAuth whiteList={["/", "/login", "/properties", "/property/:id", "/compare", "/mess", "/mess/:id", "/about", "/blog", "/blog/:slug", "/terms", "/diagnostics/location"]}>
              <AppContent />
            </RequireAuth>
          </ComparisonProvider>
        </LocationProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
