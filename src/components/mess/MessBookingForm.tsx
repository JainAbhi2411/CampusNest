import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'miaoda-auth-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, IndianRupee, Utensils, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { messBookingApi } from '@/db/api';
import type { MessFacility } from '@/types/types';

const bookingSchema = z.object({
  booking_type: z.enum(['trial', 'daily', 'weekly', 'monthly']),
  meal_types: z.array(z.string()).min(1, 'Select at least one meal type'),
  start_date: z.string().min(1, 'Start date is required'),
  dietary_preference: z.string().optional(),
  special_requirements: z.string().optional(),
  advance_payment: z.string().min(1, 'Advance payment is required'),
  terms_accepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface MessBookingFormProps {
  messId: string;
  mess?: MessFacility;
  onSuccess?: () => void;
}

const MessBookingForm: React.FC<MessBookingFormProps> = ({ messId, mess, onSuccess }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      booking_type: 'monthly',
      meal_types: [],
      start_date: '',
      dietary_preference: '',
      special_requirements: '',
      advance_payment: '',
      terms_accepted: false,
    },
  });

  const bookingType = form.watch('booking_type');
  const mealTypes = form.watch('meal_types');

  const calculateTotal = () => {
    if (!mess) return 0;

    let total = 0;
    const hasBreakfast = mealTypes.includes('breakfast');
    const hasLunch = mealTypes.includes('lunch');
    const hasDinner = mealTypes.includes('dinner');

    switch (bookingType) {
      case 'trial':
        total = mess.trial_meal_price || 0;
        break;
      case 'daily':
        if (hasBreakfast) total += mess.breakfast_price || 0;
        if (hasLunch) total += mess.lunch_price || 0;
        if (hasDinner) total += mess.dinner_price || 0;
        break;
      case 'weekly':
        total = mess.weekly_price || 0;
        break;
      case 'monthly':
        total = mess.monthly_price || 0;
        break;
    }

    return total;
  };

  const totalAmount = calculateTotal();
  const minAdvance = Math.round(totalAmount * 0.2);

  const onSubmit = async (data: BookingFormData) => {
    if (!user) {
      toast.error('Please login to book this mess');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const endDate = data.booking_type === 'trial' ? data.start_date :
        data.booking_type === 'weekly' ? new Date(new Date(data.start_date).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] :
        data.booking_type === 'monthly' ? new Date(new Date(data.start_date).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] :
        undefined;

      await messBookingApi.createMessBooking({
        mess_id: messId,
        user_id: user.id,
        booking_type: data.booking_type,
        meal_types: data.meal_types,
        start_date: data.start_date,
        end_date: endDate,
        dietary_preference: data.dietary_preference || undefined,
        special_requirements: data.special_requirements || undefined,
        total_amount: totalAmount,
        advance_payment: parseFloat(data.advance_payment),
        payment_status: 'pending',
      });

      toast.success('Mess booking created successfully! You will receive payment details shortly.');
      form.reset();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book Mess Facility</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="booking_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Booking Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select booking type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="trial">Trial Meal</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly Plan</SelectItem>
                      <SelectItem value="monthly">Monthly Plan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {bookingType === 'trial' && 'Try one meal before committing'}
                    {bookingType === 'daily' && 'Pay per day for selected meals'}
                    {bookingType === 'weekly' && 'All meals for 7 days'}
                    {bookingType === 'monthly' && 'All meals for 30 days'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="meal_types"
              render={() => (
                <FormItem>
                  <FormLabel>Meal Types</FormLabel>
                  <div className="space-y-2">
                    {['breakfast', 'lunch', 'dinner'].map((meal) => (
                      <FormField
                        key={meal}
                        control={form.control}
                        name="meal_types"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(meal)}
                                onCheckedChange={(checked) => {
                                  const updatedValue = checked
                                    ? [...(field.value || []), meal]
                                    : (field.value || []).filter((value) => value !== meal);
                                  field.onChange(updatedValue);
                                }}
                                disabled={bookingType === 'weekly' || bookingType === 'monthly'}
                              />
                            </FormControl>
                            <FormLabel className="font-normal capitalize">
                              {meal}
                              {mess && (
                                <span className="ml-2 text-muted-foreground">
                                  (₹{meal === 'breakfast' ? mess.breakfast_price : meal === 'lunch' ? mess.lunch_price : mess.dinner_price})
                                </span>
                              )}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  {(bookingType === 'weekly' || bookingType === 'monthly') && (
                    <FormDescription>
                      All meals included in {bookingType} plan
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        min={minDate}
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dietary_preference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dietary Preference (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select preference" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="jain">Jain</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="special_requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requirements (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Allergies, food preferences, etc..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount:</span>
                <span className="text-xl font-bold">₹{totalAmount}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Minimum advance: ₹{minAdvance} (20%)
              </div>
            </div>

            <FormField
              control={form.control}
              name="advance_payment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Advance Payment</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        min={minAdvance}
                        max={totalAmount}
                        step="10"
                        placeholder={`Minimum ₹${minAdvance}`}
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Pay at least 20% to confirm booking
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="terms_accepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I accept the terms and conditions
                    </FormLabel>
                    <FormDescription>
                      By booking, you agree to the mess policies and payment terms
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-secondary" />
                <span>Flexible meal timings</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-secondary" />
                <span>Hygienic food preparation</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-secondary" />
                <span>Variety of cuisines</span>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              <Utensils className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Processing...' : 'Confirm Booking'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MessBookingForm;
