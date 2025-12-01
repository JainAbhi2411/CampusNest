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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Users, Home, IndianRupee, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { bookingApi } from '@/db/api';
import type { BookingType, Property } from '@/types/types';

const visitSchema = z.object({
  booking_date: z.string().min(1, 'Date is required'),
  booking_time: z.string().optional(),
  number_of_people: z.string().min(1, 'Number of people is required'),
  preferred_time_slot: z.string().min(1, 'Please select a time slot'),
  notes: z.string().optional(),
});

const bookNowSchema = z.object({
  move_in_date: z.string().min(1, 'Move-in date is required'),
  booking_duration: z.string().min(1, 'Duration is required'),
  number_of_people: z.string().min(1, 'Number of people is required'),
  advance_payment: z.string().min(1, 'Advance payment is required'),
  special_requests: z.string().optional(),
  terms_accepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

type VisitFormData = z.infer<typeof visitSchema>;
type BookNowFormData = z.infer<typeof bookNowSchema>;

interface BookingFormProps {
  propertyId: string;
  property?: Property;
  onSuccess?: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ propertyId, property, onSuccess }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'visit' | 'book'>('visit');

  const visitForm = useForm<VisitFormData>({
    resolver: zodResolver(visitSchema),
    defaultValues: {
      booking_date: '',
      booking_time: '',
      number_of_people: '1',
      preferred_time_slot: '',
      notes: '',
    },
  });

  const bookNowForm = useForm<BookNowFormData>({
    resolver: zodResolver(bookNowSchema),
    defaultValues: {
      move_in_date: '',
      booking_duration: '',
      number_of_people: '1',
      advance_payment: '',
      special_requests: '',
      terms_accepted: false,
    },
  });

  const onVisitSubmit = async (data: VisitFormData) => {
    if (!user) {
      toast.error('Please login to schedule a visit');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      await bookingApi.createBooking({
        property_id: propertyId,
        user_id: user.id,
        booking_type: 'visit' as BookingType,
        booking_date: data.booking_date,
        booking_time: data.booking_time || undefined,
        number_of_people: parseInt(data.number_of_people),
        preferred_time_slot: data.preferred_time_slot,
        notes: data.notes || undefined,
      });

      toast.success('Visit scheduled successfully! The property owner will contact you soon.');
      visitForm.reset();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to schedule visit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onBookNowSubmit = async (data: BookNowFormData) => {
    if (!user) {
      toast.error('Please login to book this property');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      await bookingApi.createBooking({
        property_id: propertyId,
        user_id: user.id,
        booking_type: 'room' as BookingType,
        booking_date: data.move_in_date,
        move_in_date: data.move_in_date,
        booking_duration: data.booking_duration,
        number_of_people: parseInt(data.number_of_people),
        advance_payment: parseFloat(data.advance_payment),
        payment_status: 'pending',
        special_requests: data.special_requests || undefined,
      });

      toast.success('Booking request submitted! You will receive payment details shortly.');
      bookNowForm.reset();
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
  const advancePayment = property ? Math.round(property.price * 0.1) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book This Property</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'visit' | 'book')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="visit">Schedule Visit</TabsTrigger>
            <TabsTrigger value="book">Book Now</TabsTrigger>
          </TabsList>

          <TabsContent value="visit" className="mt-4">
            <Form {...visitForm}>
              <form onSubmit={visitForm.handleSubmit(onVisitSubmit)} className="space-y-4">
                <FormField
                  control={visitForm.control}
                  name="booking_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visit Date</FormLabel>
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
                  control={visitForm.control}
                  name="preferred_time_slot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Time Slot</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time slot" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                          <SelectItem value="afternoon">Afternoon (12 PM - 4 PM)</SelectItem>
                          <SelectItem value="evening">Evening (4 PM - 7 PM)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={visitForm.control}
                  name="booking_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specific Time (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="time"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Specify exact time if you have a preference
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={visitForm.control}
                  name="number_of_people"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of People</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select number" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 Person</SelectItem>
                          <SelectItem value="2">2 People</SelectItem>
                          <SelectItem value="3">3 People</SelectItem>
                          <SelectItem value="4">4 People</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={visitForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any questions or special requirements..."
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  <Calendar className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Scheduling...' : 'Schedule Visit'}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="book" className="mt-4">
            <Form {...bookNowForm}>
              <form onSubmit={bookNowForm.handleSubmit(onBookNowSubmit)} className="space-y-4">
                <FormField
                  control={bookNowForm.control}
                  name="move_in_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Move-in Date</FormLabel>
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
                  control={bookNowForm.control}
                  name="booking_duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Booking Duration</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1_month">1 Month</SelectItem>
                          <SelectItem value="3_months">3 Months</SelectItem>
                          <SelectItem value="6_months">6 Months</SelectItem>
                          <SelectItem value="1_year">1 Year</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={bookNowForm.control}
                  name="number_of_people"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Occupants</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select number" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 Person</SelectItem>
                          <SelectItem value="2">2 People</SelectItem>
                          <SelectItem value="3">3 People</SelectItem>
                          <SelectItem value="4">4 People</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={bookNowForm.control}
                  name="advance_payment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Advance Payment</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            min="0"
                            step="100"
                            placeholder={`Minimum ₹${advancePayment}`}
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Minimum 10% advance payment required (₹{advancePayment})
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={bookNowForm.control}
                  name="special_requests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Requests (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any special requirements or preferences..."
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={bookNowForm.control}
                  name="terms_accepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="mt-1"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I accept the terms and conditions
                        </FormLabel>
                        <FormDescription>
                          By booking, you agree to our cancellation policy and payment terms
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-secondary" />
                    <span>Instant booking confirmation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-secondary" />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-secondary" />
                    <span>24/7 customer support</span>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  <Home className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
