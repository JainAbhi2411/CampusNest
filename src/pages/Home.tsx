import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building2, Search, Calendar, Shield, ArrowRight, Star, Quote, PlusCircle, TrendingUp, Users, CheckCircle2, ChevronDown } from 'lucide-react';
import EnhancedSearchBar from '@/components/property/EnhancedSearchBar';
import PropertyCard from '@/components/property/PropertyCard';
import CategorySection from '@/components/property/CategorySection';
import AnimatedBackground from '@/components/ui/animated-background';
import MorphingBlobs from '@/components/ui/morphing-blobs';
import AnimatedText from '@/components/ui/animated-text';
import Advanced3DSlider from '@/components/ui/advanced-3d-slider';
import MagneticButton from '@/components/ui/magnetic-button';
import ParallaxSection from '@/components/ui/parallax-section';
import { propertyApi } from '@/db/api';
import type { Property } from '@/types/types';
import PageMeta from '@/components/common/PageMeta';
import { Skeleton } from '@/components/ui/skeleton';

const Home: React.FC = () => {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProperties();
  }, []);

  const loadFeaturedProperties = async () => {
    try {
      const properties = await propertyApi.getProperties({ available: true }, 1, 6);
      setFeaturedProperties(properties);
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testimonials = [
    {
      id: 1,
      title: 'Amazing Experience',
      description: 'Found my perfect PG within days! The platform is so easy to use and all properties are verified. The 360° virtual tours helped me make the right decision without visiting multiple places.',
      image: '',
      author: 'Priya Sharma',
      role: 'Engineering Student, IIT Delhi',
    },
    {
      id: 2,
      title: 'Highly Recommended',
      description: 'Roomsaathi made my accommodation search stress-free. The booking process was smooth, and the property owner was very responsive. Great platform for students!',
      image: '',
      author: 'Rahul Verma',
      role: 'MBA Student, IIM Bangalore',
    },
    {
      id: 3,
      title: 'Best Platform',
      description: 'I love how I can filter properties by distance from my college. The detailed information about nearby mess facilities was really helpful. Highly recommend to all students!',
      image: '',
      author: 'Ananya Patel',
      role: 'Medical Student, AIIMS',
    },
    {
      id: 4,
      title: 'Excellent Service',
      description: 'The customer support team was incredibly helpful throughout my search. Found a great flat near my university with all the amenities I needed. Thank you Roomsaathi!',
      image: '',
      author: 'Arjun Reddy',
      role: 'Law Student, NLU Delhi',
    },
  ];

  const features = [
    {
      icon: Search,
      title: 'Easy Search',
      description: 'Find accommodations near your campus with our powerful search filters',
    },
    {
      icon: Building2,
      title: 'Verified Properties',
      description: 'All properties are verified to ensure quality and safety',
    },
    {
      icon: Calendar,
      title: 'Quick Booking',
      description: 'Schedule visits or book rooms instantly with our simple booking system',
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Your data and transactions are protected with industry-standard security',
    },
  ];

  return (
    <>
      <PageMeta
        title="Roomsaathi - Find Your Perfect Student Accommodation"
        description="Search and book student accommodations including PGs, flats, hostels, and rooms near your campus"
      />

      <div className="min-h-screen">
        {/* Hero Section with Advanced Animations */}
        <section className="relative bg-primary text-primary-foreground py-20 xl:py-32 overflow-hidden">
          {/* Animated Background Layers */}
          <AnimatedBackground />
          <MorphingBlobs />
          
          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              {/* Animated Title with Gradient */}
              <AnimatedText
                text="Find Your Perfect Student Accommodation"
                className="text-4xl xl:text-6xl font-bold mb-6"
                type="gradient"
              />
              
              <p className="text-lg xl:text-xl mb-8 text-primary-foreground/90 animate-fade-in-delay">
                Search from thousands of verified PGs, flats, hostels, and rooms near your campus
              </p>
              
              <div className="max-w-4xl mx-auto animate-fade-in-delay-2">
                <EnhancedSearchBar showQuickFilters={true} />
              </div>

              {/* Floating Stats */}
              <div className="mt-12 grid grid-cols-3 gap-4 xl:gap-8 animate-fade-in-delay-2">
                <div className="backdrop-blur-sm bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-smooth">
                  <div className="text-3xl xl:text-4xl font-bold">5000+</div>
                  <div className="text-sm xl:text-base text-primary-foreground/80">Properties</div>
                </div>
                <div className="backdrop-blur-sm bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-smooth">
                  <div className="text-3xl xl:text-4xl font-bold">10K+</div>
                  <div className="text-sm xl:text-base text-primary-foreground/80">Happy Students</div>
                </div>
                <div className="backdrop-blur-sm bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-smooth">
                  <div className="text-3xl xl:text-4xl font-bold">50+</div>
                  <div className="text-sm xl:text-base text-primary-foreground/80">Cities</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* List Your Property CTA Section - Column Layout with Hover Features */}
        <section className="relative py-16 xl:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-20 -left-20 w-64 h-64 xl:w-96 xl:h-96 bg-secondary/10 rounded-full blur-3xl animate-float-slow" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 xl:w-[500px] xl:h-[500px] bg-primary/10 rounded-full blur-3xl animate-float-medium" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 xl:w-[600px] xl:h-[600px] bg-secondary/5 rounded-full blur-3xl animate-pulse-slow" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-12 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-secondary/20 to-primary/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4 animate-bounce-subtle border border-secondary/20">
                <TrendingUp className="h-4 w-4 text-secondary" />
                <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent font-semibold">For Property Owners</span>
              </div>
              
              <h2 className="text-2xl xl:text-4xl font-bold leading-tight mb-3">
                List Your Property &{' '}
                <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">Reach Thousands</span>
              </h2>
              
              <p className="text-sm xl:text-base text-muted-foreground max-w-2xl mx-auto mb-2">
                Choose your preferred listing method and start connecting with students today
              </p>
              
              <p className="text-xs text-muted-foreground/70 italic">
                Hover over each option to see features
              </p>
            </div>

            {/* Column Layout - Cards Stacked Vertically */}
            <div className="space-y-6 max-w-2xl mx-auto mb-12">
              {/* Option 1: Quick Listing - Expandable on Hover */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary to-secondary/50 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-700 animate-pulse-subtle" />
                
                <Card className="relative overflow-hidden border-2 border-transparent hover:border-secondary/30 transition-all duration-500 backdrop-blur-sm bg-background/95 group-hover:shadow-2xl animate-fade-in-up">
                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 via-secondary/5 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Floating particles effect */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 group-hover:animate-ping-slow" />
                  
                  <CardContent className="relative z-10 p-6">
                    {/* Always Visible: Icon and Title */}
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-secondary/30 rounded-xl blur-md group-hover:blur-lg transition-all duration-300" />
                          <div className="relative w-14 h-14 bg-gradient-to-br from-secondary to-secondary/80 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                            <PlusCircle className="h-7 w-7 text-white" />
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1 group-hover:text-secondary transition-colors duration-300">Quick Listing</h3>
                          <p className="text-sm text-muted-foreground">Simple & Fast - Perfect for individual owners</p>
                        </div>
                      </div>

                      {/* Hover indicator */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground group-hover:text-secondary transition-colors duration-300">
                        <span className="hidden xl:inline">Hover to see features</span>
                        <ChevronDown className="h-4 w-4 group-hover:translate-y-1 transition-transform duration-300" />
                      </div>
                    </div>

                    {/* Hidden by default, revealed on hover with animation */}
                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out">
                      <div className="overflow-hidden">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 transform translate-y-4 group-hover:translate-y-0">
                          {/* Feature list */}
                          <div className="pt-4 pb-4 border-t border-border/50 mt-2">
                            <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Key Features:</h4>
                            <ul className="space-y-2.5 mb-5">
                              <li className="flex items-start gap-3 text-sm group/item hover:translate-x-2 transition-transform duration-200">
                                <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5 group-hover/item:scale-125 transition-transform duration-200" />
                                <span>Fill out a simple property listing form</span>
                              </li>
                              <li className="flex items-start gap-3 text-sm group/item hover:translate-x-2 transition-transform duration-200">
                                <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5 group-hover/item:scale-125 transition-transform duration-200" />
                                <span>Our team reviews within 24-48 hours</span>
                              </li>
                              <li className="flex items-start gap-3 text-sm group/item hover:translate-x-2 transition-transform duration-200">
                                <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5 group-hover/item:scale-125 transition-transform duration-200" />
                                <span>Property goes live instantly after approval</span>
                              </li>
                              <li className="flex items-start gap-3 text-sm group/item hover:translate-x-2 transition-transform duration-200">
                                <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5 group-hover/item:scale-125 transition-transform duration-200" />
                                <span>Students can view and contact you directly</span>
                              </li>
                            </ul>

                            {/* Button */}
                            <Link to="/for-owners">
                              <Button 
                                className="w-full bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary text-white shadow-lg hover:shadow-xl hover:shadow-secondary/50 transition-all duration-300 relative overflow-hidden"
                              >
                                <span className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300" />
                                <span className="relative flex items-center justify-center gap-2">
                                  <PlusCircle className="h-4 w-4" />
                                  Start Listing Now
                                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Option 2: Full Management - Expandable on Hover */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-700 animate-pulse-subtle" />
                
                <Card className="relative overflow-hidden border-2 border-transparent hover:border-primary/30 transition-all duration-500 backdrop-blur-sm bg-background/95 group-hover:shadow-2xl animate-fade-in-up animation-delay-200">
                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Floating particles effect */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 group-hover:animate-ping-slow" />
                  
                  <CardContent className="relative z-10 p-6">
                    {/* Always Visible: Icon and Title */}
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary/30 rounded-xl blur-md group-hover:blur-lg transition-all duration-300" />
                          <div className="relative w-14 h-14 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                            <Building2 className="h-7 w-7 text-white" />
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors duration-300">Full Management System</h3>
                          <p className="text-sm text-muted-foreground">Professional & Advanced - Ideal for property managers</p>
                        </div>
                      </div>

                      {/* Hover indicator */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground group-hover:text-primary transition-colors duration-300">
                        <span className="hidden xl:inline">Hover to see features</span>
                        <ChevronDown className="h-4 w-4 group-hover:translate-y-1 transition-transform duration-300" />
                      </div>
                    </div>

                    {/* Hidden by default, revealed on hover with animation */}
                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-in-out">
                      <div className="overflow-hidden">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 transform translate-y-4 group-hover:translate-y-0">
                          {/* Feature list */}
                          <div className="pt-4 pb-4 border-t border-border/50 mt-2">
                            <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Key Features:</h4>
                            <ul className="space-y-2.5 mb-5">
                              <li className="flex items-start gap-3 text-sm group/item hover:translate-x-2 transition-transform duration-200">
                                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-125 transition-transform duration-200" />
                                <span>Manage multiple properties from one dashboard</span>
                              </li>
                              <li className="flex items-start gap-3 text-sm group/item hover:translate-x-2 transition-transform duration-200">
                                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-125 transition-transform duration-200" />
                                <span>Track bookings, payments, and tenant information</span>
                              </li>
                              <li className="flex items-start gap-3 text-sm group/item hover:translate-x-2 transition-transform duration-200">
                                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-125 transition-transform duration-200" />
                                <span>Real-time analytics and performance insights</span>
                              </li>
                              <li className="flex items-start gap-3 text-sm group/item hover:translate-x-2 transition-transform duration-200">
                                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 group-hover/item:scale-125 transition-transform duration-200" />
                                <span>Automated notifications and communication tools</span>
                              </li>
                            </ul>

                            {/* Button */}
                            <a
                              href="https://rosamanage.netlify.app/"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button 
                                className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl hover:shadow-primary/50 transition-all duration-300 relative overflow-hidden"
                              >
                                <span className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300" />
                                <span className="relative flex items-center justify-center gap-2">
                                  <Building2 className="h-4 w-4" />
                                  Access Management Portal
                                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                              </Button>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Stats with impressive hover effects */}
            <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto animate-fade-in-up">
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary to-primary rounded-xl opacity-0 group-hover:opacity-100 blur transition-all duration-300" />
                <div className="relative text-center p-4 bg-background/80 backdrop-blur-sm rounded-xl border border-border/50 group-hover:border-transparent transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                  <div className="text-2xl xl:text-3xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">10K+</div>
                  <div className="text-xs text-muted-foreground">Active Students</div>
                </div>
              </div>
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-xl opacity-0 group-hover:opacity-100 blur transition-all duration-300" />
                <div className="relative text-center p-4 bg-background/80 backdrop-blur-sm rounded-xl border border-border/50 group-hover:border-transparent transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                  <div className="text-2xl xl:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">95%</div>
                  <div className="text-xs text-muted-foreground">Occupancy Rate</div>
                </div>
              </div>
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary to-primary rounded-xl opacity-0 group-hover:opacity-100 blur transition-all duration-300" />
                <div className="relative text-center p-4 bg-background/80 backdrop-blur-sm rounded-xl border border-border/50 group-hover:border-transparent transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                  <div className="text-2xl xl:text-3xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">24/7</div>
                  <div className="text-xs text-muted-foreground">Support</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 xl:py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl xl:text-4xl font-bold mb-2">Featured Properties</h2>
                <p className="text-muted-foreground text-lg">
                  Explore our handpicked accommodations
                </p>
              </div>
              <Link to="/properties">
                <Button variant="outline">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="flex-shrink-0 w-[85vw] xl:w-[calc(33.333%-1rem)] snap-start">
                    <Skeleton className="h-48 w-full bg-muted" />
                    <CardContent className="p-4 space-y-3">
                      <Skeleton className="h-6 w-3/4 bg-muted" />
                      <Skeleton className="h-4 w-full bg-muted" />
                      <Skeleton className="h-4 w-2/3 bg-muted" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : featuredProperties.length > 0 ? (
              <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                {featuredProperties.map((property) => (
                  <div key={property.id} className="flex-shrink-0 w-[85vw] xl:w-[calc(33.333%-1rem)] snap-start">
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">No properties available at the moment</p>
              </div>
            )}
          </div>
        </section>

        <CategorySection />

        {/* Testimonials Section with 3D Slider */}
        <section className="relative py-16 xl:py-24 bg-background overflow-hidden isolate">
          {/* Background Decoration */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 xl:mb-12">
              <div className="inline-flex items-center justify-center w-12 h-12 xl:w-16 xl:h-16 rounded-full bg-secondary/10 mb-3 xl:mb-4">
                <Quote className="h-6 w-6 xl:h-8 xl:w-8 text-secondary" />
              </div>
              <h2 className="text-2xl xl:text-4xl font-bold mb-2 xl:mb-4">What Students Say</h2>
              <p className="text-sm xl:text-lg text-muted-foreground">
                Hear from students who found their perfect accommodation
              </p>
            </div>

            <Advanced3DSlider slides={testimonials} autoPlay={true} interval={5000} type="testimonial" />
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-16 xl:py-24 bg-muted/30 isolate">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 xl:mb-12">
              <h2 className="text-2xl xl:text-4xl font-bold mb-2 xl:mb-4">Why Choose Roomsaathi?</h2>
              <p className="text-sm xl:text-lg text-muted-foreground">
                We make finding student accommodation simple and hassle-free
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card 
                    key={index} 
                    className="shadow-card hover:shadow-3xl transition-smooth-slow card-3d group"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <CardContent className="p-4 xl:p-6 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 xl:w-16 xl:h-16 rounded-full bg-secondary/10 mb-3 xl:mb-4 group-hover:bg-secondary/20 transition-smooth group-hover:scale-110">
                        <Icon className="h-6 w-6 xl:h-8 xl:w-8 text-secondary group-hover:animate-scale-pulse" />
                      </div>
                      <h3 className="text-base xl:text-xl font-semibold mb-1 xl:mb-2">{feature.title}</h3>
                      <p className="text-sm xl:text-base text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section with Magnetic Button */}
        <section className="relative py-12 xl:py-24 bg-primary text-primary-foreground overflow-hidden isolate">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-secondary rounded-full blur-3xl animate-pulse-glow" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl xl:text-4xl font-bold mb-4 xl:mb-6">
              Ready to Find Your Perfect Stay?
            </h2>
            <p className="text-base xl:text-xl mb-6 xl:mb-8 text-primary-foreground/90">
              Join thousands of students who have found their ideal accommodation through Roomsaathi
            </p>
            <Link to="/properties">
              <MagneticButton variant="secondary" size="lg" className="min-h-[48px]">
                Start Searching
                <ArrowRight className="ml-2 h-4 w-4 xl:h-5 xl:w-5" />
              </MagneticButton>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
