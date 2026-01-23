import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  DollarSign, 
  Home,
  Phone,
  Mail,
  User
} from 'lucide-react';
import { propertyApi } from '@/db/api';
import type { Property } from '@/types/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from 'miaoda-auth-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const PropertyVerificationPanel: React.FC = () => {
  const [pendingProperties, setPendingProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadPendingProperties();
  }, []);

  const loadPendingProperties = async () => {
    try {
      setIsLoading(true);
      const properties = await propertyApi.getPendingProperties();
      setPendingProperties(properties);
    } catch (error) {
      console.error('Error loading pending properties:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pending properties',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (propertyId: string) => {
    if (!user) return;

    try {
      setIsProcessing(true);
      await propertyApi.verifyProperty(propertyId, user.id);
      toast({
        title: 'Property Verified',
        description: 'The property has been verified and is now visible on the website',
      });
      await loadPendingProperties();
    } catch (error) {
      console.error('Error verifying property:', error);
      toast({
        title: 'Error',
        description: 'Failed to verify property',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectClick = (property: Property) => {
    setSelectedProperty(property);
    setIsRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!user || !selectedProperty) return;

    if (!rejectionReason.trim()) {
      toast({
        title: 'Rejection Reason Required',
        description: 'Please provide a reason for rejection',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsProcessing(true);
      await propertyApi.rejectProperty(selectedProperty.id, user.id, rejectionReason);
      toast({
        title: 'Property Rejected',
        description: 'The property has been rejected',
      });
      setIsRejectDialogOpen(false);
      setRejectionReason('');
      setSelectedProperty(null);
      await loadPendingProperties();
    } catch (error) {
      console.error('Error rejecting property:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject property',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getAccommodationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      pg: 'PG',
      flat: 'Flat',
      hostel: 'Hostel',
      room: 'Room',
    };
    return labels[type] || type;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Property Verification</CardTitle>
          <CardDescription>Loading pending properties...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Property Verification
          </CardTitle>
          <CardDescription>
            Review and verify property submissions from owners
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingProperties.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No pending properties to review</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingProperties.map((property) => (
                <Card key={property.id} className="border-2">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold">{property.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline">
                              {getAccommodationTypeLabel(property.accommodation_type)}
                            </Badge>
                            <span>•</span>
                            <span>Submitted {new Date(property.submitted_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Pending
                        </Badge>
                      </div>

                      {property.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {property.description}
                        </p>
                      )}

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{property.address}, {property.city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">₹{property.price.toLocaleString()}/month</span>
                        </div>
                      </div>

                      <div className="border-t pt-4 space-y-2">
                        <h4 className="text-sm font-semibold">Owner Contact Information</h4>
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 text-sm">
                          {property.owner_name && (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>{property.owner_name}</span>
                            </div>
                          )}
                          {property.owner_contact && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{property.owner_contact}</span>
                            </div>
                          )}
                          {property.owner_email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{property.owner_email}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="border-t pt-4 space-y-2">
                        <h4 className="text-sm font-semibold">Property Features</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">
                            {property.gender_preference === 'any' ? 'Any Gender' : 
                             property.gender_preference === 'male' ? 'Male Only' : 'Female Only'}
                          </Badge>
                          <Badge variant="secondary">
                            {property.occupancy_type.charAt(0).toUpperCase() + property.occupancy_type.slice(1)} Occupancy
                          </Badge>
                          {property.food_included && <Badge variant="secondary">Food Included</Badge>}
                          {property.wifi_available && <Badge variant="secondary">WiFi</Badge>}
                          {property.ac_available && <Badge variant="secondary">AC</Badge>}
                          {property.parking_available && <Badge variant="secondary">Parking</Badge>}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => handleVerify(property.id)}
                          disabled={isProcessing}
                          className="flex-1"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Verify Property
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleRejectClick(property)}
                          disabled={isProcessing}
                          className="flex-1"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Property</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this property. This will help the owner understand what needs to be improved.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="rejection-reason">Rejection Reason</Label>
            <Textarea
              id="rejection-reason"
              placeholder="e.g., Incomplete information, unclear images, incorrect pricing..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRejectDialogOpen(false);
                setRejectionReason('');
                setSelectedProperty(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectConfirm}
              disabled={isProcessing || !rejectionReason.trim()}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyVerificationPanel;
