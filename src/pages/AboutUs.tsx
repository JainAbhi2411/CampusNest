import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, Eye, Heart, Award, TrendingUp, Shield, Zap } from 'lucide-react';
import PageMeta from '@/components/common/PageMeta';
import AnimatedText from '@/components/ui/animated-text';

const AboutUs: React.FC = () => {
  const stats = [
    { label: 'Active Users', value: '100+', icon: Users },
    { label: 'Properties Listed', value: '30+', icon: TrendingUp },
    { label: 'Cities Covered', value: '3+', icon: Award },
    { label: 'Success Rate', value: '95%', icon: Shield },
  ];

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To simplify student accommodation search and make quality housing accessible to every student across India.',
    },
    {
      icon: Eye,
      title: 'Our Vision',
      description: 'To become India\'s most trusted platform for student accommodation, connecting students with their perfect homes.',
    },
    {
      icon: Heart,
      title: 'Our Values',
      description: 'Trust, transparency, and student-first approach guide everything we do at Roomsaathi.',
    },
    {
      icon: Zap,
      title: 'Our Promise',
      description: 'Verified properties, honest reviews, and dedicated support to ensure your accommodation search is stress-free.',
    },
  ];

  const team = [
    {
      name: 'Rajesh Kumar',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      bio: 'Former student who experienced accommodation struggles firsthand and decided to solve it for others.',
    },
    {
      name: 'Priya Sharma',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      bio: 'Expert in property management with 10+ years of experience in student housing.',
    },
    {
      name: 'Amit Patel',
      role: 'Chief Technology Officer',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      bio: 'Tech enthusiast passionate about building solutions that make a real difference.',
    },
    {
      name: 'Sneha Reddy',
      role: 'Head of Customer Success',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      bio: 'Dedicated to ensuring every student finds their perfect accommodation match.',
    },
  ];

  const milestones = [
    { year: '2024', title: 'Research Phase', description: 'Conducted extensive research in Sikar, Jaipur, and Kota, gathering valuable feedback from students about accommodation challenges' },
    { year: 'Mar 2025', title: 'Founded Roomsaathi', description: 'Officially launched Roomsaathi with a vision to revolutionize student accommodation search' },
    { year: 'May 2025', title: 'First 100 Users', description: 'Reached our first milestone of helping 100 students find their perfect accommodation' },
    { year: 'Aug 2025', title: 'Expanded to 4 Cities', description: 'Grew our presence across 4 major educational hubs in Rajasthan' },
    { year: 'Oct 2025', title: 'First Property Listed', description: 'Partnered with our first verified property owner, marking the beginning of our property network' },
    { year: 'Dec 2025', title: '30+ Properties', description: 'Rapidly expanded our property portfolio to over 30 verified listings' },
    { year: 'Jan 2026', title: '100 Happy Students', description: 'Celebrated helping 100 students find their ideal homes and continuing to grow' },
  ];

  return (
    <>
      <PageMeta
        title="About Us - Roomsaathi"
        description="Learn about Roomsaathi's mission to simplify student accommodation search and make quality housing accessible to every student"
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-primary text-primary-foreground py-16 xl:py-32 overflow-hidden isolate">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 xl:w-96 xl:h-96 bg-secondary rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-0 left-0 w-64 h-64 xl:w-96 xl:h-96 bg-accent rounded-full blur-3xl animate-pulse-slow animation-delay-1000" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <AnimatedText
                text="About Roomsaathi"
                className="text-3xl xl:text-6xl font-bold mb-4 xl:mb-6"
                type="fade-up"
              />
              <p className="text-base xl:text-xl text-primary-foreground/90 animate-fade-in-delay">
                Your trusted companion in finding the perfect student accommodation
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 xl:py-16 bg-background isolate">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card
                    key={index}
                    className="text-center shadow-card hover:shadow-xl transition-all duration-500 hover:scale-105 animate-fade-in-up"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <CardContent className="p-4 xl:p-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 xl:w-16 xl:h-16 rounded-full bg-secondary/10 mb-3 xl:mb-4 group-hover:rotate-12 transition-transform duration-300">
                        <Icon className="h-6 w-6 xl:h-8 xl:w-8 text-secondary animate-pulse-subtle" />
                      </div>
                      <div className="text-2xl xl:text-4xl font-bold mb-1 xl:mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{stat.value}</div>
                      <div className="text-xs xl:text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-12 xl:py-24 bg-muted/30 isolate relative overflow-hidden">
          {/* Floating decorative elements */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-20 left-10 w-20 h-20 bg-secondary/30 rounded-full blur-2xl animate-float-slow" />
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary/30 rounded-full blur-2xl animate-float-medium" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-8 xl:mb-12">
              <h2 className="text-2xl xl:text-4xl font-bold mb-4 xl:mb-6 animate-fade-in-up">Our Story</h2>
              <div className="space-y-3 xl:space-y-4 text-sm xl:text-lg text-muted-foreground text-left">
                <p className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                  Roomsaathi was born from a simple yet powerful idea: every student deserves a safe, comfortable, and affordable place to call home during their educational journey.
                </p>
                <p className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                  As students ourselves, we experienced the challenges of finding accommodation firsthand. The endless searches, unreliable listings, hidden costs, and lack of transparency made what should be an exciting time incredibly stressful.
                </p>
                <p className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                  We decided to change that. In 2025, we launched Roomsaathi with a mission to simplify the accommodation search process and connect students with verified, quality housing options.
                </p>
                <p className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                  Today, we're proud to have helped over 100 students find their perfect accommodation across multiple cities in Rajasthan. But we're just getting started.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-12 xl:py-24 bg-background isolate">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 xl:mb-12 animate-fade-in-up">
              <h2 className="text-2xl xl:text-4xl font-bold mb-3 xl:mb-4">What Drives Us</h2>
              <p className="text-muted-foreground text-sm xl:text-lg">
                Our core values and commitments to the student community
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card
                    key={index}
                    className="shadow-card hover:shadow-2xl transition-all duration-500 group hover:scale-105 hover:-rotate-1 animate-fade-in-up border-l-4 border-l-transparent hover:border-l-secondary"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-4 xl:p-8">
                      <div className="flex items-start gap-3 xl:gap-4">
                        <div className="flex-shrink-0">
                          <div className="inline-flex items-center justify-center w-10 h-10 xl:w-16 xl:h-16 rounded-full bg-secondary/10 group-hover:bg-secondary/20 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                            <Icon className="h-5 w-5 xl:h-8 xl:w-8 text-secondary group-hover:animate-pulse" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base xl:text-2xl font-bold mb-1 xl:mb-3 group-hover:text-secondary transition-colors duration-300">{value.title}</h3>
                          <p className="text-xs xl:text-lg text-muted-foreground">{value.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-12 xl:py-24 bg-muted/30 isolate relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-secondary/20 via-transparent to-primary/20 animate-gradient-shift" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-8 xl:mb-12 animate-fade-in-up">
              <h2 className="text-2xl xl:text-4xl font-bold mb-3 xl:mb-4">Our Journey</h2>
              <p className="text-muted-foreground text-sm xl:text-lg">
                Key milestones in our growth story
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-4 xl:space-y-8">
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className="flex gap-3 xl:gap-6 group animate-slide-in-right"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex-shrink-0 w-14 xl:w-24 text-right">
                      <div className="inline-block px-2 xl:px-4 py-1 xl:py-2 rounded-full bg-secondary text-secondary-foreground font-bold text-xs xl:text-base group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg">
                        {milestone.year}
                      </div>
                    </div>
                    <div className="flex-1 pb-4 xl:pb-8 border-l-2 border-border pl-3 xl:pl-6 relative group-hover:border-secondary transition-colors duration-300">
                      <div className="absolute left-0 top-2 w-3 h-3 xl:w-4 xl:h-4 rounded-full bg-secondary -translate-x-[7px] xl:-translate-x-[9px] group-hover:scale-150 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-secondary/50 animate-pulse-subtle" />
                      <h3 className="text-sm xl:text-xl font-bold mb-1 xl:mb-2 group-hover:text-secondary transition-colors duration-300">{milestone.title}</h3>
                      <p className="text-xs xl:text-base text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-12 xl:py-24 bg-background isolate">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 xl:mb-12 animate-fade-in-up">
              <h2 className="text-2xl xl:text-4xl font-bold mb-3 xl:mb-4">Meet Our Team</h2>
              <p className="text-muted-foreground text-sm xl:text-lg">
                The passionate people behind Roomsaathi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-8">
              {team.map((member, index) => (
                <Card
                  key={index}
                  className="shadow-card hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden group animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 group-hover:rotate-3"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <CardContent className="p-4 xl:p-6 text-center relative">
                    <h3 className="text-base xl:text-xl font-bold mb-1 group-hover:text-secondary transition-colors duration-300">{member.name}</h3>
                    <p className="text-secondary font-medium mb-2 xl:mb-3 text-sm xl:text-base">{member.role}</p>
                    <p className="text-xs xl:text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 xl:py-24 bg-primary text-primary-foreground isolate relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-10 left-10 w-40 h-40 bg-secondary rounded-full blur-3xl animate-float-slow" />
            <div className="absolute bottom-10 right-10 w-56 h-56 bg-accent rounded-full blur-3xl animate-float-medium" />
          </div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-2xl xl:text-4xl font-bold mb-4 xl:mb-6 animate-fade-in-up">
              Join Thousands of Happy Students
            </h2>
            <p className="text-sm xl:text-xl mb-6 xl:mb-8 text-primary-foreground/90 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              Start your accommodation search with Roomsaathi today
            </p>
            <a
              href="/properties"
              className="inline-flex items-center justify-center px-6 xl:px-8 py-3 rounded-lg bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/90 transition-all duration-300 min-h-[48px] text-sm xl:text-base hover:scale-110 hover:shadow-2xl hover:shadow-secondary/50 animate-fade-in-up animate-pulse-glow"
              style={{ animationDelay: '200ms' }}
            >
              Find Your Perfect Room
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutUs;
