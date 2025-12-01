import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingDown, Info } from 'lucide-react';
import type { Property } from '@/types/types';

interface RentCalculatorProps {
  property: Property;
}

type DurationType = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface CalculationResult {
  baseRent: number;
  foodCharges: number;
  parkingCharges: number;
  maintenanceCharges: number;
  discount: number;
  total: number;
  perDay: number;
  savings: number;
}

const RentCalculator: React.FC<RentCalculatorProps> = ({ property }) => {
  const [duration, setDuration] = useState<DurationType>('monthly');
  const [includeFoodService, setIncludeFoodService] = useState(property.food_included);
  const [includeParkingService, setIncludeParkingService] = useState(false);
  const [calculation, setCalculation] = useState<CalculationResult | null>(null);

  useEffect(() => {
    calculateRent();
  }, [duration, includeFoodService, includeParkingService]);

  const calculateRent = () => {
    const baseMonthlyRent = property.price;
    
    // Duration multipliers and discount rates
    const durationConfig = {
      daily: { multiplier: 1 / 30, discount: 0, label: 'day' },
      weekly: { multiplier: 7 / 30, discount: 0.05, label: 'week' },
      monthly: { multiplier: 1, discount: 0, label: 'month' },
      yearly: { multiplier: 12, discount: 0.15, label: 'year' }
    };

    const config = durationConfig[duration];
    let baseRent = baseMonthlyRent * config.multiplier;

    // Accommodation type specific charges
    let foodCharges = 0;
    let parkingCharges = 0;
    let maintenanceCharges = 0;

    // Food charges based on accommodation type
    if (includeFoodService && !property.food_included) {
      switch (property.accommodation_type) {
        case 'pg':
          foodCharges = 3000 * config.multiplier; // ₹3000/month for PG
          break;
        case 'hostel':
          foodCharges = 2500 * config.multiplier; // ₹2500/month for hostel
          break;
        case 'flat':
        case 'room':
          foodCharges = 4000 * config.multiplier; // ₹4000/month for flat/room (external service)
          break;
      }
    }

    // Parking charges
    if (includeParkingService && !property.parking_available) {
      parkingCharges = 500 * config.multiplier; // ₹500/month
    }

    // Maintenance charges (only for flats and yearly duration)
    if (property.accommodation_type === 'flat' && duration === 'yearly') {
      maintenanceCharges = 1000 * config.multiplier; // ₹1000/month
    }

    // Calculate subtotal
    const subtotal = baseRent + foodCharges + parkingCharges + maintenanceCharges;

    // Apply discount
    const discountAmount = subtotal * config.discount;
    const total = subtotal - discountAmount;

    // Calculate per day rate
    const daysInPeriod = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365
    };
    const perDay = total / daysInPeriod[duration];

    // Calculate savings compared to daily rate
    const dailyRate = baseMonthlyRent / 30;
    const totalDays = daysInPeriod[duration];
    const withoutDiscount = dailyRate * totalDays;
    const savings = withoutDiscount - total;

    setCalculation({
      baseRent,
      foodCharges,
      parkingCharges,
      maintenanceCharges,
      discount: discountAmount,
      total,
      perDay,
      savings: duration !== 'daily' ? savings : 0
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getDurationLabel = () => {
    const labels = {
      daily: 'Per Day',
      weekly: 'Per Week',
      monthly: 'Per Month',
      yearly: 'Per Year'
    };
    return labels[duration];
  };

  const getDiscountPercentage = () => {
    const discounts = {
      daily: 0,
      weekly: 5,
      monthly: 0,
      yearly: 15
    };
    return discounts[duration];
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Smart Rent Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="duration">Rental Duration</Label>
          <Select value={duration} onValueChange={(value) => setDuration(value as DurationType)}>
            <SelectTrigger id="duration">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly (5% off)</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly (15% off)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="food-service">Food Service</Label>
              <p className="text-xs text-muted-foreground">
                {property.food_included ? 'Included in rent' : 'Add meal service'}
              </p>
            </div>
            <Switch
              id="food-service"
              checked={includeFoodService}
              onCheckedChange={setIncludeFoodService}
              disabled={property.food_included}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="parking-service">Parking</Label>
              <p className="text-xs text-muted-foreground">
                {property.parking_available ? 'Included in rent' : 'Add parking space'}
              </p>
            </div>
            <Switch
              id="parking-service"
              checked={includeParkingService}
              onCheckedChange={setIncludeParkingService}
              disabled={property.parking_available}
            />
          </div>
        </div>

        {calculation && (
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Base Rent</span>
                <span>{formatCurrency(calculation.baseRent)}</span>
              </div>

              {calculation.foodCharges > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Food Service</span>
                  <span>{formatCurrency(calculation.foodCharges)}</span>
                </div>
              )}

              {calculation.parkingCharges > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Parking</span>
                  <span>{formatCurrency(calculation.parkingCharges)}</span>
                </div>
              )}

              {calculation.maintenanceCharges > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Maintenance</span>
                  <span>{formatCurrency(calculation.maintenanceCharges)}</span>
                </div>
              )}

              {calculation.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span className="flex items-center gap-1">
                    <TrendingDown className="h-3 w-3" />
                    Discount ({getDiscountPercentage()}%)
                  </span>
                  <span>-{formatCurrency(calculation.discount)}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold">Total {getDurationLabel()}</span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(calculation.total)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Per Day Rate</span>
                <span>{formatCurrency(calculation.perDay)}</span>
              </div>
            </div>

            {calculation.savings > 0 && (
              <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      You save {formatCurrency(calculation.savings)}
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                      Compared to daily rate for the same period
                    </p>
                  </div>
                </div>
              </div>
            )}

            {duration === 'yearly' && (
              <div className="bg-primary/10 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="mt-0.5">Best Value</Badge>
                  <p className="text-xs text-muted-foreground">
                    Yearly rentals include maximum discount and priority maintenance
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground flex items-start gap-2">
            <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span>
              Prices are estimates. Final charges may vary based on actual usage and property policies.
              {property.accommodation_type === 'pg' && ' PG rates typically include basic utilities.'}
              {property.accommodation_type === 'hostel' && ' Hostel rates may include mess charges.'}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RentCalculator;
