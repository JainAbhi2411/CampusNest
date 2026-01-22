import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Target, Eye, Heart, Award, TrendingUp, Shield, Zap } from 'lucide-react';
import PageMeta from '@/components/common/PageMeta';
import AnimatedText from '@/components/ui/animated-text';

const AboutUs: React.FC = () => {
  const stats = [
    { label: 'Active Users', value: '10,000+', icon: Users },
    { label: 'Properties Listed', value: '5,000+', icon: TrendingUp },
    { label: 'Cities Covered', value: '50+', icon: Award },
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
    { year: '2020', title: 'Founded', description: 'Roomsaathi was born from a student\'s struggle to find accommodation' },
    { year: '2021', title: 'First 1000 Users', description: 'Reached our first milestone of helping 1000 students' },
    { year: '2022', title: 'Expanded to 25 Cities', description: 'Grew our presence across major educational hubs' },
    { year: '2023', title: '5000+ Properties', description: 'Partnered with thousands of verified property owners' },
    { year: '2024', title: '10K+ Happy Students', description: 'Continuing to grow and serve the student community' },
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
                    className="text-center shadow-card hover:shadow-xl transition-all duration-300 hover:scale-105"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-4 xl:p-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 xl:w-16 xl:h-16 rounded-full bg-secondary/10 mb-3 xl:mb-4">
                        <Icon className="h-6 w-6 xl:h-8 xl:w-8 text-secondary" />
                      </div>
                      <div className="text-2xl xl:text-4xl font-bold mb-1 xl:mb-2">{stat.value}</div>
                      <div className="text-xs xl:text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-12 xl:py-24 bg-muted/30 isolate">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-8 xl:mb-12">
              <h2 className="text-2xl xl:text-4xl font-bold mb-4 xl:mb-6">Our Story</h2>
              <div className="space-y-3 xl:space-y-4 text-sm xl:text-lg text-muted-foreground text-left">
                <p>
                  Roomsaathi was born from a simple yet powerful idea: every student deserves a safe, comfortable, and affordable place to call home during their educational journey.
                </p>
                <p>
                  As students ourselves, we experienced the challenges of finding accommodation firsthand. The endless searches, unreliable listings, hidden costs, and lack of transparency made what should be an exciting time incredibly stressful.
                </p>
                <p>
                  We decided to change that. In 2020, we launched Roomsaathi with a mission to simplify the accommodation search process and connect students with verified, quality housing options.
                </p>
                <p>
                  Today, we're proud to have helped over 10,000 students find their perfect accommodation across 50+ cities in India. But we're just getting started.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-12 xl:py-24 bg-background isolate">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 xl:mb-12">
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
                    className="shadow-card hover:shadow-xl transition-all duration-300 group hover:scale-105"
                  >
                    <CardContent className="p-4 xl:p-8">
                      <div className="flex items-start gap-3 xl:gap-4">
                        <div className="flex-shrink-0">
                          <div className="inline-flex items-center justify-center w-10 h-10 xl:w-16 xl:h-16 rounded-full bg-secondary/10 group-hover:bg-secondary/20 transition-all duration-300">
                            <Icon className="h-5 w-5 xl:h-8 xl:w-8 text-secondary" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base xl:text-2xl font-bold mb-1 xl:mb-3">{value.title}</h3>
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
        <section className="py-12 xl:py-24 bg-muted/30 isolate">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 xl:mb-12">
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
                    className="flex gap-3 xl:gap-6 group"
                  >
                    <div className="flex-shrink-0 w-14 xl:w-24 text-right">
                      <div className="inline-block px-2 xl:px-4 py-1 xl:py-2 rounded-full bg-secondary text-secondary-foreground font-bold text-xs xl:text-base">
                        {milestone.year}
                      </div>
                    </div>
                    <div className="flex-1 pb-4 xl:pb-8 border-l-2 border-border pl-3 xl:pl-6 relative">
                      <div className="absolute left-0 top-2 w-3 h-3 xl:w-4 xl:h-4 rounded-full bg-secondary -translate-x-[7px] xl:-translate-x-[9px] group-hover:scale-150 transition-transform duration-300" />
                      <h3 className="text-sm xl:text-xl font-bold mb-1 xl:mb-2">{milestone.title}</h3>
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
            <div className="text-center mb-8 xl:mb-12">
              <h2 className="text-2xl xl:text-4xl font-bold mb-3 xl:mb-4">Meet Our Team</h2>
              <p className="text-muted-foreground text-sm xl:text-lg">
                The passionate people behind Roomsaathi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-8">
              {team.map((member, index) => (
                <Card
                  key={index}
                  className="shadow-card hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <CardContent className="p-4 xl:p-6 text-center">
                    <h3 className="text-base xl:text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-secondary font-medium mb-2 xl:mb-3 text-sm xl:text-base">{member.role}</p>
                    <p className="text-xs xl:text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 xl:py-24 bg-primary text-primary-foreground isolate">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl xl:text-4xl font-bold mb-4 xl:mb-6">
              Join Thousands of Happy Students
            </h2>
            <p className="text-sm xl:text-xl mb-6 xl:mb-8 text-primary-foreground/90">
              Start your accommodation search with Roomsaathi today
            </p>
            <a
              href="/properties"
              className="inline-flex items-center justify-center px-6 xl:px-8 py-3 rounded-lg bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/90 transition-all duration-300 min-h-[48px] text-sm xl:text-base hover:scale-105"
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
