import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Home, MapPin, DollarSign, CheckCircle2, ArrowLeft, Users, Utensils, Wifi, Car, Wind } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PageMeta from '@/components/common/PageMeta';
import { propertyApi } from '@/db/api';
import { Switch } from '@/components/ui/switch';
import type { AccommodationType, GenderPreference, OccupancyType } from '@/types/types';

const ForOwners: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    accommodation_type: '' as AccommodationType | '',
    address: '',
    city: '',
    location: '',
    price: '',
    description: '',
    gender_preference: 'any' as GenderPreference,
    occupancy_type: 'single' as OccupancyType,
    food_included: false,
    wifi_available: false,
    ac_available: false,
    parking_available: false,
    owner_name: '',
    owner_email: '',
    owner_contact: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.title || !formData.accommodation_type || !formData.address || 
          !formData.city || !formData.price || !formData.owner_contact || !formData.owner_name) {
        toast({
          title: 'Missing Information',
          description: 'Please fill in all required fields',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.owner_contact)) {
        toast({
          title: 'Invalid Phone Number',
          description: 'Please enter a valid 10-digit phone number',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      const submissionData = {
        title: formData.title,
        description: formData.description,
        accommodation_type: formData.accommodation_type,
        price: Number.parseFloat(formData.price),
        price_period: 'month',
        location: formData.location || formData.city,
        address: formData.address,
        city: formData.city,
        owner_contact: formData.owner_contact,
        owner_name: formData.owner_name,
        owner_email: formData.owner_email || null,
        gender_preference: formData.gender_preference,
        occupancy_type: formData.occupancy_type,
        food_included: formData.food_included,
        wifi_available: formData.wifi_available,
        ac_available: formData.ac_available,
        parking_available: formData.parking_available,
        amenities: [],
      };

      await propertyApi.submitProperty(submissionData);

      setIsSubmitted(true);
      toast({
        title: 'Property Submitted Successfully!',
        description: 'RoomSaathi team will contact you soon.',
      });

      setFormData({
        title: '',
        accommodation_type: '' as AccommodationType | '',
        address: '',
        city: '',
        location: '',
        price: '',
        description: '',
        gender_preference: 'any',
        occupancy_type: 'single',
        food_included: false,
        wifi_available: false,
        ac_available: false,
        parking_available: false,
        owner_name: '',
        owner_email: '',
        owner_contact: '',
      });
    } catch (error) {
      console.error('Error submitting property:', error);
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your property. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <PageMeta
          title="Property Submitted - StayNearby"
          description="Your property has been submitted successfully"
        />
        <div className="min-h-screen bg-muted/30 flex items-center justify-center py-12 px-4">
          <Card className="max-w-2xl w-full shadow-lg">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-primary/10 p-6">
                  <CheckCircle2 className="h-16 w-16 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl xl:text-3xl font-bold mb-4">
                We Received Your Details!
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Thank you for submitting your property. The RoomSaathi team will review your listing and contact you soon.
              </p>
              <div className="space-y-3">
                <Button
                  size="lg"
                  onClick={() => setIsSubmitted(false)}
                  className="w-full xl:w-auto"
                >
                  Submit Another Property
                </Button>
                <br />
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="w-full xl:w-auto"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="List Your Property - StayNearby"
        description="List your property on StayNearby and reach thousands of students looking for accommodation"
      />

      <div className="min-h-screen bg-muted/30 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            
            <div className="text-center">
              <h1 className="text-3xl xl:text-4xl font-bold mb-2">List Your Property</h1>
              <p className="text-muted-foreground text-lg">
                Fill in the details below and our team will contact you soon
              </p>
            </div>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-primary" />
                Property Information
              </CardTitle>
              <CardDescription>
                Please provide accurate information about your property. Fields marked with * are required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Home className="h-5 w-5 text-secondary" />
                    Property Details
                  </h3>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Property Title *</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="e.g., Spacious 2BHK near University"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accommodation_type">Property Type *</Label>
                      <Select 
                        value={formData.accommodation_type} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, accommodation_type: value as AccommodationType }))}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pg">PG (Paying Guest)</SelectItem>
                          <SelectItem value="flat">Flat/Apartment</SelectItem>
                          <SelectItem value="hostel">Hostel</SelectItem>
                          <SelectItem value="room">Room for Rent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Property Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe your property, its features, and what makes it special..."
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gender_preference">Gender Preference</Label>
                      <Select 
                        value={formData.gender_preference} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, gender_preference: value as GenderPreference }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="male">Male Only</SelectItem>
                          <SelectItem value="female">Female Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="occupancy_type">Occupancy Type</Label>
                      <Select 
                        value={formData.occupancy_type} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, occupancy_type: value as OccupancyType }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="double">Double</SelectItem>
                          <SelectItem value="triple">Triple</SelectItem>
                          <SelectItem value="multiple">Multiple</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Amenities</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Utensils className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Food Included</span>
                        </div>
                        <Switch
                          checked={formData.food_included}
                          onCheckedChange={(checked) => handleSwitchChange('food_included', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Wifi className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">WiFi Available</span>
                        </div>
                        <Switch
                          checked={formData.wifi_available}
                          onCheckedChange={(checked) => handleSwitchChange('wifi_available', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Wind className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">AC Available</span>
                        </div>
                        <Switch
                          checked={formData.ac_available}
                          onCheckedChange={(checked) => handleSwitchChange('ac_available', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Parking Available</span>
                        </div>
                        <Switch
                          checked={formData.parking_available}
                          onCheckedChange={(checked) => handleSwitchChange('parking_available', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-secondary" />
                    Location Details
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Street address, landmark"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Area/Locality</Label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="Area or locality name"
                        value={formData.location}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-secondary" />
                    Pricing
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="price">Monthly Rent (₹) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      placeholder="e.g., 8000"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary" />
                    Contact Information
                  </h3>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="owner_name">Your Name *</Label>
                      <Input
                        id="owner_name"
                        name="owner_name"
                        placeholder="Full name"
                        value={formData.owner_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="owner_email">Email</Label>
                      <Input
                        id="owner_email"
                        name="owner_email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.owner_email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="owner_contact">Phone Number *</Label>
                    <Input
                      id="owner_contact"
                      name="owner_contact"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={formData.owner_contact}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>Submitting...</>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        Submit Property Listing
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-muted-foreground text-center mt-4">
                    By submitting, you agree to our terms and conditions. Our team will review your listing and contact you soon.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ForOwners;
