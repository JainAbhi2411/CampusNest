import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { messApi } from '@/db/api';
import type { MessFacility } from '@/types/types';
import { Utensils, MapPin, Star, TrendingUp } from 'lucide-react';

const MessStats: React.FC = () => {
  const [messFacilities, setMessFacilities] = useState<MessFacility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessFacilities();
  }, []);

  const loadMessFacilities = async () => {
    try {
      setLoading(true);
      const data = await messApi.getAllMess();
      setMessFacilities(data);
    } catch (error) {
      console.error('Error loading mess facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalMess = messFacilities.length;
  const vegCount = messFacilities.filter((m) => m.dietary_options.includes('veg')).length;
  const nonVegCount = messFacilities.filter((m) => m.dietary_options.includes('non-veg')).length;
  const avgRating =
    messFacilities.length > 0
      ? messFacilities.reduce((sum, m) => sum + m.average_rating, 0) / messFacilities.length
      : 0;

  const cityCounts = messFacilities.reduce((acc, mess) => {
    acc[mess.city] = (acc[mess.city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCities = Object.entries(cityCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const maxCount = topCities.length > 0 ? topCities[0][1] : 1;

  const stats = [
    {
      title: 'Total Mess Facilities',
      value: totalMess,
      icon: Utensils,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Vegetarian',
      value: vegCount,
      icon: Utensils,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Non-Vegetarian',
      value: nonVegCount,
      icon: Utensils,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Average Rating',
      value: avgRating.toFixed(1),
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 bg-muted" />
          ))}
        </div>
        <Skeleton className="h-64 bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {topCities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Top Cities by Mess Facilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCities.map(([city, count]) => (
                <div key={city} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{city}</span>
                    <span className="text-muted-foreground">{count} facilities</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MessStats;
