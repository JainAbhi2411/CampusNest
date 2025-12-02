import React, { useEffect, useState } from 'react';
import { useAuth } from 'miaoda-auth-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield } from 'lucide-react';
import { profileApi } from '@/db/api';
import type { Profile } from '@/types/types';
import PageMeta from '@/components/common/PageMeta';
import DashboardStats from '@/components/admin/DashboardStats';
import BookingManagement from '@/components/admin/BookingManagement';
import { toast } from 'sonner';

const Admin: React.FC = () => {
  const { user } = useAuth();
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
      <PageMeta title="Admin Panel - StayNearby" description="Manage properties, bookings, and users" />

      <div className="min-h-screen bg-muted/30">
        <div className="bg-primary text-primary-foreground py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-8 w-8" />
              <h1 className="text-3xl xl:text-4xl font-bold">Admin Panel</h1>
            </div>
            <p className="text-lg text-primary-foreground/90">
              Manage bookings, properties, and monitor platform activity
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="bookings">Booking Management</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <DashboardStats />
              
              <div className="bg-muted/50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
                <p className="text-muted-foreground">
                  Switch to the Booking Management tab to view and manage all booking requests.
                  You can filter by status, type, date range, and search for specific bookings.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="bookings" className="space-y-6">
              <BookingManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Admin;
