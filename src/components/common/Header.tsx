import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "miaoda-auth-react";
import { Button } from "@/components/ui/button";
import { Home, Building2, UtensilsCrossed, User, LogOut, Menu, X, Shield } from "lucide-react";
import { profileApi } from "@/db/api";
import type { Profile } from "@/types/types";
import routes from "../../routes";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigation = routes.filter((route) => route.visible !== false);

  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      setProfile(null);
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    try {
      const data = await profileApi.getProfile(user.id);
      setProfile(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Properties', path: '/properties', icon: Building2 },
    { name: 'Mess Facilities', path: '/mess', icon: UtensilsCrossed },
  ];

  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 transition-smooth hover:opacity-80">
              <Building2 className="h-8 w-8 text-secondary" />
              <span className="text-xl xl:text-2xl font-bold">CampusNest</span>
            </Link>
          </div>

          <div className="hidden xl:flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
                    location.pathname === item.path
                      ? "bg-secondary text-secondary-foreground"
                      : "hover:bg-primary-light"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}

            {user ? (
              <>
                {profile?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
                      location.pathname === '/admin'
                        ? "bg-secondary text-secondary-foreground"
                        : "hover:bg-primary-light"
                    }`}
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
                    location.pathname === '/dashboard'
                      ? "bg-secondary text-secondary-foreground"
                      : "hover:bg-primary-light"
                  }`}
                >
                  <User className="h-4 w-4" />
                  Dashboard
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="secondary" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>

          <div className="xl:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:bg-primary-light transition-smooth"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="xl:hidden pb-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
                    location.pathname === item.path
                      ? "bg-secondary text-secondary-foreground"
                      : "hover:bg-primary-light"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}

            {user ? (
              <>
                {profile?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
                      location.pathname === '/admin'
                        ? "bg-secondary text-secondary-foreground"
                        : "hover:bg-primary-light"
                    }`}
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
                    location.pathname === '/dashboard'
                      ? "bg-secondary text-secondary-foreground"
                      : "hover:bg-primary-light"
                  }`}
                >
                  <User className="h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-primary-light transition-smooth"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="secondary" size="sm" className="w-full">
                  Login
                </Button>
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
