import React, { useEffect, useState } from 'react';
import { useAuth } from 'miaoda-auth-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Calendar, Users } from 'lucide-react';
import { propertyApi, bookingApi, profileApi } from '@/db/api';
import type { Profile } from '@/types/types';
import PageMeta from '@/components/common/PageMeta';
import { toast } from 'sonner';

const Admin: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalBookings: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  useEffect(() => {
    if (profile && profile.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
    } else if (profile && profile.role === 'admin') {
      loadStats();
    }
  }, [profile, navigate]);

  const loadProfile = async () => {
    if (!user) return;
    try {
      const data = await profileApi.getProfile(user.id);
      setProfile(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const loadStats = async () => {
    try {
      const [properties, bookings, users] = await Promise.all([
        propertyApi.getProperties({}, 1, 1000),
        bookingApi.getAllBookings(1, 1000),
        profileApi.getAllProfiles(),
      ]);
      setStats({
        totalProperties: properties.length,
        totalBookings: bookings.length,
        totalUsers: users.length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  if (!profile || profile.role !== 'admin') {
    return null;
  }

  return (
    <>
      <PageMeta title="Admin Panel - StayNearby" description="Manage properties, bookings, and users" />

      <div className="min-h-screen bg-muted/30">
        <div className="bg-primary text-primary-foreground py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl xl:text-4xl font-bold mb-2">Admin Panel</h1>
            <p className="text-lg text-primary-foreground/90">
              Manage properties, bookings, and users
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProperties}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBookings}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">Information</TabsTrigger>
                  <TabsTrigger value="properties">Properties</TabsTrigger>
                  <TabsTrigger value="bookings">Bookings</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4">
                  <div className="text-center py-12">
                    <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Admin Dashboard</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Welcome to the admin panel. Use the tabs above to manage properties and bookings.
                      You can add new properties, update existing ones, and manage user bookings.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="properties" className="space-y-4">
                  <div className="text-center py-12">
                    <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Property Management</h3>
                    <p className="text-muted-foreground">
                      Property management features will be available here.
                      You can add, edit, and delete properties from this section.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="bookings" className="space-y-4">
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Booking Management</h3>
                    <p className="text-muted-foreground">
                      View and manage all bookings from this section.
                      You can update booking statuses and handle user requests.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Admin;
