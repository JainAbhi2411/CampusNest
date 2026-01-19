import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import MessFacilities from './pages/MessFacilities';
import MessDetails from './pages/MessDetails';
import Compare from './pages/Compare';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Login from './pages/Login';
import AboutUs from './pages/AboutUs';
import Blogs from './pages/Blogs';
import BlogPost from './pages/BlogPost';
import TermsAndConditions from './pages/TermsAndConditions';
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
    name: 'Compare Properties',
    path: '/compare',
    element: <Compare />,
    visible: false,
  },
  {
    name: 'Mess Facilities',
    path: '/mess',
    element: <MessFacilities />,
    visible: false,
  },
  {
    name: 'Mess Details',
    path: '/mess/:id',
    element: <MessDetails />,
    visible: false,
  },
  {
    name: 'About Us',
    path: '/about',
    element: <AboutUs />,
    visible: false,
  },
  {
    name: 'Blog',
    path: '/blog',
    element: <Blogs />,
    visible: false,
  },
  {
    name: 'Blog Post',
    path: '/blog/:slug',
    element: <BlogPost />,
    visible: false,
  },
  {
    name: 'Terms and Conditions',
    path: '/terms',
    element: <TermsAndConditions />,
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
