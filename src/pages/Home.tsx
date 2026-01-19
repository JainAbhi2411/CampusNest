import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Search, Calendar, Shield, ArrowRight, Star, Quote } from 'lucide-react';
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
        <section className="py-16 xl:py-24 bg-background relative overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
                <Quote className="h-8 w-8 text-secondary" />
              </div>
              <h2 className="text-3xl xl:text-4xl font-bold mb-4">What Students Say</h2>
              <p className="text-muted-foreground text-lg">
                Hear from students who found their perfect accommodation
              </p>
            </div>

            <Advanced3DSlider slides={testimonials} autoPlay={true} interval={5000} type="testimonial" />
          </div>
        </section>

        {/* Features Section with Parallax */}
        <ParallaxSection speed={0.3}>
          <section className="py-16 xl:py-24 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl xl:text-4xl font-bold mb-4">Why Choose Roomsaathi?</h2>
                <p className="text-muted-foreground text-lg">
                  We make finding student accommodation simple and hassle-free
                </p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
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
                      <CardContent className="p-6 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4 group-hover:bg-secondary/20 transition-smooth group-hover:scale-110">
                          <Icon className="h-8 w-8 text-secondary group-hover:animate-scale-pulse" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>
        </ParallaxSection>

        {/* CTA Section with Magnetic Button */}
        <section className="py-16 xl:py-24 bg-primary text-primary-foreground relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-secondary rounded-full blur-3xl animate-pulse-glow" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl xl:text-4xl font-bold mb-6">
              Ready to Find Your Perfect Stay?
            </h2>
            <p className="text-lg xl:text-xl mb-8 text-primary-foreground/90">
              Join thousands of students who have found their ideal accommodation through Roomsaathi
            </p>
            <Link to="/properties">
              <MagneticButton variant="secondary" size="lg">
                Start Searching
                <ArrowRight className="ml-2 h-5 w-5" />
              </MagneticButton>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;


