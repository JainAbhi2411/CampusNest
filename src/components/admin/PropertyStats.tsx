import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Building2,
  Home,
  Hotel,
  DoorOpen,
  MapPin,
  IndianRupee,
  TrendingUp,
  Users,
} from 'lucide-react';
import { propertyApi } from '@/db/api';
import type { Property } from '@/types/types';

interface PropertyStatsData {
  total: number;
  byType: {
    pg: number;
    flat: number;
    hostel: number;
    room: number;
  };
  byCities: { city: string; count: number }[];
  averagePrice: number;
  recentAdditions: number;
}

const PropertyStats: React.FC = () => {
  const [stats, setStats] = useState<PropertyStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const result = await propertyApi.getProperties({}, 1, 10000);
      const properties = result;

      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const byType = {
        pg: properties.filter((p) => p.accommodation_type === 'pg').length,
        flat: properties.filter((p) => p.accommodation_type === 'flat').length,
        hostel: properties.filter((p) => p.accommodation_type === 'hostel').length,
        room: properties.filter((p) => p.accommodation_type === 'room').length,
      };

      const cityMap = new Map<string, number>();
      properties.forEach((p) => {
        const city = p.city || 'Unknown';
        cityMap.set(city, (cityMap.get(city) || 0) + 1);
      });

      const byCities = Array.from(cityMap.entries())
        .map(([city, count]) => ({ city, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const totalPrice = properties.reduce((sum, p) => sum + (p.price || 0), 0);
      const averagePrice = properties.length > 0 ? Math.round(totalPrice / properties.length) : 0;

      const recentAdditions = properties.filter((p) => {
        const createdAt = new Date(p.created_at || '');
        return createdAt >= thirtyDaysAgo;
      }).length;

      setStats({
        total: properties.length,
        byType,
        byCities,
        averagePrice,
        recentAdditions,
      });
    } catch (error) {
      console.error('Error loading property stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <Skeleton className="h-4 w-24 bg-muted" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Properties',
      value: stats.total,
      icon: Building2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'PG Accommodations',
      value: stats.byType.pg,
      icon: Home,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Flats',
      value: stats.byType.flat,
      icon: Building2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Hostels',
      value: stats.byType.hostel,
      icon: Hotel,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Rooms',
      value: stats.byType.room,
      icon: DoorOpen,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Average Price',
      value: `₹${stats.averagePrice.toLocaleString()}`,
      icon: IndianRupee,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'Recent Additions',
      value: stats.recentAdditions,
      subtitle: 'Last 30 days',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                {stat.subtitle && (
                  <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {stats.byCities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Top Cities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.byCities.map((city, index) => (
                <div key={city.city} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                      {index + 1}
                    </div>
                    <span className="font-medium">{city.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{city.count} properties</span>
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${(city.count / stats.total) * 100}%` }}
                      />
                    </div>
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

export default PropertyStats;
