import React, { useEffect, useState } from 'react';
import { useAuth } from 'miaoda-auth-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Building2, Calendar, BarChart3, Utensils, LogOut, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { profileApi } from '@/db/api';
import type { Profile } from '@/types/types';
import PageMeta from '@/components/common/PageMeta';
import DashboardStats from '@/components/admin/DashboardStats';
import BookingManagement from '@/components/admin/BookingManagement';
import PropertyStats from '@/components/admin/PropertyStats';
import PropertyManagement from '@/components/admin/PropertyManagement';
import MessStats from '@/components/admin/MessStats';
import MessManagement from '@/components/admin/MessManagement';
import PropertyVerificationPanel from '@/components/admin/PropertyVerificationPanel';
import { toast } from 'sonner';

const Admin: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (profile && profile.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
    }
  }, [profile, navigate]);

  const loadProfile = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await profileApi.getProfile(user.id);
      setProfile(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4 animate-pulse" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!profile || profile.role !== 'admin') {
    return null;
  }

  return (
    <>
      <PageMeta title="Admin Panel - Roomsaathi" description="Manage properties, bookings, and platform statistics" />

      <div className="min-h-screen bg-muted/30">
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-8 xl:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="h-8 w-8" />
                  <h1 className="text-3xl xl:text-4xl font-bold">Admin Dashboard</h1>
                </div>
                <p className="text-lg text-primary-foreground/90">
                  Complete property and booking management system
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-8">
              <TabsTrigger value="overview" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="verification" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Verification
              </TabsTrigger>
              <TabsTrigger value="properties" className="gap-2">
                <Building2 className="h-4 w-4" />
                Properties
              </TabsTrigger>
              <TabsTrigger value="mess" className="gap-2">
                <Utensils className="h-4 w-4" />
                Mess
              </TabsTrigger>
              <TabsTrigger value="bookings" className="gap-2">
                <Calendar className="h-4 w-4" />
                Bookings
              </TabsTrigger>
              <TabsTrigger value="statistics" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Statistics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Property Overview</h2>
                  <PropertyStats />
                </div>
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Mess Overview</h2>
                  <MessStats />
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Booking Overview</h2>
                <DashboardStats />
              </div>
            </TabsContent>

            <TabsContent value="verification" className="space-y-6">
              <PropertyVerificationPanel />
            </TabsContent>

            <TabsContent value="properties" className="space-y-6">
              <PropertyManagement />
            </TabsContent>

            <TabsContent value="mess" className="space-y-6">
              <MessManagement />
            </TabsContent>

            <TabsContent value="bookings" className="space-y-6">
              <BookingManagement />
            </TabsContent>

            <TabsContent value="statistics" className="space-y-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Property Statistics</h2>
                  <PropertyStats />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">Mess Statistics</h2>
                  <MessStats />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">Booking Statistics</h2>
                  <DashboardStats />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Admin;
