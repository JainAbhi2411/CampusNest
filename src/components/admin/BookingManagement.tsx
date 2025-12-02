import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  User,
  Home,
  IndianRupee,
  Phone,
} from 'lucide-react';
import { toast } from 'sonner';
import { bookingApi } from '@/db/api';
import type { BookingWithDetails, BookingStatus, BookingType } from '@/types/types';

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [filters, setFilters] = useState({
    status: '' as BookingStatus | '',
    booking_type: '' as BookingType | '',
    search: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    loadBookings();
  }, [page, filters]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const result = await bookingApi.getAdminBookings({
        ...filters,
        status: filters.status || undefined,
        booking_type: filters.booking_type || undefined,
        page,
        pageSize: 20,
      });
      setBookings(result.bookings);
      setTotal(result.total);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      await bookingApi.updateBookingStatus(bookingId, newStatus);
      toast.success(`Booking ${newStatus} successfully`);
      loadBookings();
      if (selectedBooking?.id === bookingId) {
        setDetailsOpen(false);
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking status');
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    const variants: Record<BookingStatus, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      pending: { variant: 'secondary', label: 'Pending' },
      confirmed: { variant: 'default', label: 'Confirmed' },
      completed: { variant: 'outline', label: 'Completed' },
      cancelled: { variant: 'destructive', label: 'Cancelled' },
    };
    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getBookingTypeBadge = (type: BookingType) => {
    return type === 'visit' ? (
      <Badge variant="outline" className="gap-1">
        <Eye className="h-3 w-3" />
        Visit Request
      </Badge>
    ) : (
      <Badge variant="default" className="gap-1">
        <Home className="h-3 w-3" />
        Direct Booking
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return 'Not specified';
    return timeString;
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      booking_type: '',
      search: '',
      start_date: '',
      end_date: '',
    });
    setPage(1);
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Booking Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user, property..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.booking_type}
              onValueChange={(value) => handleFilterChange('booking_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="visit">Visit Requests</SelectItem>
                <SelectItem value="room">Direct Bookings</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              placeholder="Start Date"
              value={filters.start_date}
              onChange={(e) => handleFilterChange('start_date', e.target.value)}
            />

            <Input
              type="date"
              placeholder="End Date"
              value={filters.end_date}
              onChange={(e) => handleFilterChange('end_date', e.target.value)}
            />
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Active filters:</span>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : bookings.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-mono text-xs">
                          {booking.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">
                                {booking.user?.full_name || booking.user?.username || 'Unknown'}
                              </div>
                              {booking.user?.phone && (
                                <div className="text-xs text-muted-foreground">
                                  {booking.user.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <div className="font-medium line-clamp-1">
                              {booking.property?.title || 'Unknown Property'}
                            </div>
                            <div className="text-xs text-muted-foreground line-clamp-1">
                              {booking.property?.location}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getBookingTypeBadge(booking.booking_type)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{formatDate(booking.booking_date)}</div>
                            {booking.booking_time && (
                              <div className="text-xs text-muted-foreground">
                                {formatTime(booking.booking_time)}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setDetailsOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {booking.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {booking.status === 'confirmed' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusUpdate(booking.id, 'completed')}
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Complete
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between p-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {bookings.length} of {total} bookings
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">Page {page}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={bookings.length < 20}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Bookings Found</h3>
              <p className="text-muted-foreground">
                {hasActiveFilters
                  ? 'Try adjusting your filters'
                  : 'No booking requests yet'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Complete information about this booking request
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Booking ID</div>
                  <div className="font-mono text-sm">{selectedBooking.id}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Status</div>
                  {getStatusBadge(selectedBooking.status)}
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Type</div>
                  {getBookingTypeBadge(selectedBooking.booking_type)}
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Booking Date</div>
                  <div>{formatDate(selectedBooking.booking_date)}</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  User Information
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground w-24">Name:</span>
                    <span className="font-medium">
                      {selectedBooking.user?.full_name || selectedBooking.user?.username || 'N/A'}
                    </span>
                  </div>
                  {selectedBooking.user?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground w-20">Phone:</span>
                      <span>{selectedBooking.user.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Property Information
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-muted-foreground">Title:</span>
                    <div className="font-medium">{selectedBooking.property?.title}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Location:</span>
                    <div>{selectedBooking.property?.location}, {selectedBooking.property?.city}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Type:</span>
                    <div className="capitalize">{selectedBooking.property?.accommodation_type}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Price:</span>
                    <span className="font-semibold">₹{selectedBooking.property?.price}/month</span>
                  </div>
                </div>
              </div>

              {selectedBooking.booking_type === 'visit' && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Visit Details</h4>
                  <div className="space-y-2">
                    {selectedBooking.preferred_time_slot && (
                      <div>
                        <span className="text-sm text-muted-foreground">Preferred Time:</span>
                        <div>{selectedBooking.preferred_time_slot}</div>
                      </div>
                    )}
                    {selectedBooking.number_of_people && (
                      <div>
                        <span className="text-sm text-muted-foreground">Number of People:</span>
                        <div>{selectedBooking.number_of_people}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedBooking.booking_type === 'room' && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Booking Details</h4>
                  <div className="space-y-2">
                    {selectedBooking.move_in_date && (
                      <div>
                        <span className="text-sm text-muted-foreground">Move-in Date:</span>
                        <div>{formatDate(selectedBooking.move_in_date)}</div>
                      </div>
                    )}
                    {selectedBooking.booking_duration && (
                      <div>
                        <span className="text-sm text-muted-foreground">Duration:</span>
                        <div>{selectedBooking.booking_duration}</div>
                      </div>
                    )}
                    {selectedBooking.advance_payment && (
                      <div>
                        <span className="text-sm text-muted-foreground">Advance Payment:</span>
                        <div className="font-semibold">₹{selectedBooking.advance_payment}</div>
                      </div>
                    )}
                    {selectedBooking.payment_status && (
                      <div>
                        <span className="text-sm text-muted-foreground">Payment Status:</span>
                        <Badge variant="outline" className="ml-2">
                          {selectedBooking.payment_status}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(selectedBooking.notes || selectedBooking.special_requests) && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Additional Information</h4>
                  {selectedBooking.notes && (
                    <div className="mb-2">
                      <span className="text-sm text-muted-foreground">Notes:</span>
                      <div className="bg-muted/50 p-3 rounded-lg mt-1">
                        {selectedBooking.notes}
                      </div>
                    </div>
                  )}
                  {selectedBooking.special_requests && (
                    <div>
                      <span className="text-sm text-muted-foreground">Special Requests:</span>
                      <div className="bg-muted/50 p-3 rounded-lg mt-1">
                        {selectedBooking.special_requests}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedBooking.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    className="flex-1"
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'confirmed')}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Confirm Booking
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'cancelled')}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Booking
                  </Button>
                </div>
              )}

              {selectedBooking.status === 'confirmed' && (
                <div className="pt-4 border-t">
                  <Button
                    className="w-full"
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'completed')}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark as Completed
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingManagement;
