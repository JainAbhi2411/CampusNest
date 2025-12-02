import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, RequireAuth } from 'miaoda-auth-react';
import { Toaster } from 'sonner';
import { supabase } from '@/db/supabase';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import routes from './routes';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

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
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider client={supabase}>
        <Toaster position="top-center" richColors />
        <RequireAuth whiteList={["/", "/login", "/properties", "/property/:id", "/mess"]}>
          <AppContent />
        </RequireAuth>
      </AuthProvider>
    </Router>
  );
};

export default App;
