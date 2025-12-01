import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import MessFacilities from './pages/MessFacilities';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Login from './pages/Login';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <Home />,
    visible: false,
  },
  {
    name: 'Properties',
    path: '/properties',
    element: <Properties />,
    visible: false,
  },
  {
    name: 'Property Details',
    path: '/property/:id',
    element: <PropertyDetails />,
    visible: false,
  },
  {
    name: 'Mess Facilities',
    path: '/mess',
    element: <MessFacilities />,
    visible: false,
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    element: <Dashboard />,
    visible: false,
  },
  {
    name: 'Admin',
    path: '/admin',
    element: <Admin />,
    visible: false,
  },
  {
    name: 'Login',
    path: '/login',
    element: <Login />,
    visible: false,
  },
];

export default routes;
