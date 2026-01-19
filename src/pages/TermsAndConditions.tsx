import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, FileText, Shield, Users, CreditCard, AlertCircle, Scale } from 'lucide-react';
import PageMeta from '@/components/common/PageMeta';
import AnimatedText from '@/components/ui/animated-text';

interface Section {
  id: string;
  title: string;
  icon: React.ElementType;
  content: string[];
}

const TermsAndConditions: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['general']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const sections: Section[] = [
    {
      id: 'general',
      title: 'General Terms',
      icon: FileText,
      content: [
        'By accessing and using Roomsaathi ("the Platform"), you accept and agree to be bound by the terms and provisions of this agreement.',
        'Roomsaathi is a platform that connects students with accommodation providers. We act as an intermediary and do not own, manage, or control the properties listed on our platform.',
        'These terms apply to all users of the Platform, including browsers, vendors, customers, merchants, and content contributors.',
        'We reserve the right to update, change, or replace any part of these Terms and Conditions by posting updates on our website. It is your responsibility to check this page periodically for changes.',
        'Your continued use of or access to the Platform following the posting of any changes constitutes acceptance of those changes.',
      ],
    },
    {
      id: 'user-accounts',
      title: 'User Accounts',
      icon: Users,
      content: [
        'To access certain features of the Platform, you must register for an account. You must provide accurate, complete, and current information during the registration process.',
        'You are responsible for safeguarding the password that you use to access the Platform and for any activities or actions under your password.',
        'You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.',
        'You may not use as a username the name of another person or entity that is not lawfully available for use, or a name that is offensive, vulgar, or obscene.',
        'We reserve the right to refuse service, terminate accounts, remove or edit content at our sole discretion.',
      ],
    },
    {
      id: 'property-listings',
      title: 'Property Listings & Bookings',
      icon: Shield,
      content: [
        'All property listings on Roomsaathi are provided by property owners or their authorized representatives. We strive to ensure accuracy but do not guarantee the completeness or accuracy of any listing.',
        'Property owners are responsible for the accuracy of their listings, including descriptions, photos, pricing, and availability.',
        'Booking requests made through the Platform are subject to acceptance by the property owner. A booking is confirmed only when you receive a confirmation from the property owner.',
        'Cancellation policies vary by property and are set by individual property owners. Please review the cancellation policy before making a booking.',
        'Any disputes regarding bookings, property conditions, or services should be resolved directly between you and the property owner. Roomsaathi will assist in mediation but is not liable for such disputes.',
        'We recommend visiting properties in person before making final booking decisions. Virtual tours and photos are provided for convenience but may not represent current conditions.',
      ],
    },
    {
      id: 'payments',
      title: 'Payments & Refunds',
      icon: CreditCard,
      content: [
        'Payment terms are established between you and the property owner. Roomsaathi may facilitate payment processing but does not hold or manage funds.',
        'Any advance payments, security deposits, or booking fees are paid directly to property owners unless otherwise specified.',
        'Refund policies are determined by individual property owners. Roomsaathi is not responsible for processing refunds but will assist in communication.',
        'In case of payment disputes, you should contact the property owner directly. Roomsaathi will provide reasonable assistance in resolving such disputes.',
        'All prices listed on the Platform are subject to change without notice. Confirmed bookings will honor the price agreed upon at the time of booking.',
      ],
    },
    {
      id: 'user-conduct',
      title: 'User Conduct & Prohibited Activities',
      icon: AlertCircle,
      content: [
        'You agree to use the Platform only for lawful purposes and in accordance with these Terms and Conditions.',
        'You agree not to use the Platform to post, transmit, or share any content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable.',
        'You may not use the Platform to impersonate any person or entity, or falsely state or misrepresent your affiliation with a person or entity.',
        'You may not engage in any activity that interferes with or disrupts the Platform or servers and networks connected to the Platform.',
        'You may not attempt to gain unauthorized access to any portion of the Platform, other accounts, computer systems, or networks connected to the Platform.',
        'Violation of these terms may result in immediate termination of your account and legal action if necessary.',
      ],
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      icon: Scale,
      content: [
        'Roomsaathi acts as an intermediary platform and is not responsible for the actions, quality, safety, or legality of properties listed, the truth or accuracy of listings, or the ability of property owners to provide accommodations.',
        'We do not guarantee the availability, quality, safety, or legality of any property listed on the Platform.',
        'To the fullest extent permitted by law, Roomsaathi shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Platform.',
        'Our total liability to you for any claims arising from your use of the Platform shall not exceed the amount you paid to us, if any, in the twelve (12) months prior to the action giving rise to liability.',
        'Some jurisdictions do not allow the exclusion of certain warranties or the limitation of liability for consequential damages. In such jurisdictions, our liability will be limited to the maximum extent permitted by law.',
      ],
    },
    {
      id: 'privacy',
      title: 'Privacy & Data Protection',
      icon: Shield,
      content: [
        'Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information.',
        'By using the Platform, you consent to the collection and use of your information as described in our Privacy Policy.',
        'We implement reasonable security measures to protect your personal information, but we cannot guarantee absolute security.',
        'You have the right to access, correct, or delete your personal information. Contact us to exercise these rights.',
        'We do not sell or rent your personal information to third parties without your explicit consent.',
      ],
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      icon: FileText,
      content: [
        'The Platform and its original content, features, and functionality are owned by Roomsaathi and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.',
        'You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Platform without prior written consent.',
        'User-generated content remains the property of the user, but by posting content on the Platform, you grant Roomsaathi a non-exclusive, worldwide, royalty-free license to use, reproduce, and display such content.',
      ],
    },
    {
      id: 'termination',
      title: 'Termination',
      icon: AlertCircle,
      content: [
        'We may terminate or suspend your account and access to the Platform immediately, without prior notice or liability, for any reason, including breach of these Terms and Conditions.',
        'Upon termination, your right to use the Platform will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive.',
        'You may terminate your account at any time by contacting us or using the account deletion feature in your profile settings.',
      ],
    },
    {
      id: 'governing-law',
      title: 'Governing Law & Dispute Resolution',
      icon: Scale,
      content: [
        'These Terms and Conditions shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.',
        'Any disputes arising from these terms or your use of the Platform shall be subject to the exclusive jurisdiction of the courts located in [City], India.',
        'We encourage you to contact us first to resolve any disputes informally. We will make reasonable efforts to resolve disputes amicably.',
      ],
    },
    {
      id: 'contact',
      title: 'Contact Information',
      icon: Users,
      content: [
        'If you have any questions about these Terms and Conditions, please contact us:',
        'Email: support@roomsaathi.com',
        'Phone: +91-XXXX-XXXXXX',
        'Address: [Your Business Address]',
        'We aim to respond to all inquiries within 48 hours during business days.',
      ],
    },
  ];

  const lastUpdated = 'December 1, 2024';

  return (
    <>
      <PageMeta
        title="Terms and Conditions - Roomsaathi"
        description="Read Roomsaathi's terms and conditions, user agreements, and policies"
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-primary text-primary-foreground py-16 xl:py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl animate-pulse-glow" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <AnimatedText
                text="Terms and Conditions"
                className="text-4xl xl:text-5xl font-bold mb-4"
                type="fade-up"
              />
              <p className="text-lg xl:text-xl text-primary-foreground/90 mb-4">
                Please read these terms carefully before using Roomsaathi
              </p>
              <p className="text-sm text-primary-foreground/70">
                Last Updated: {lastUpdated}
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Introduction */}
          <Card className="mb-8 shadow-card">
            <CardContent className="p-6 xl:p-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Welcome to Roomsaathi. These Terms and Conditions outline the rules and regulations for the use of our platform. By accessing this website and using our services, you accept these terms and conditions in full. Do not continue to use Roomsaathi if you do not accept all of the terms and conditions stated on this page.
              </p>
            </CardContent>
          </Card>

          {/* Table of Contents */}
          <Card className="mb-8 shadow-card">
            <CardContent className="p-4 xl:p-6">
              <h2 className="text-lg xl:text-xl font-bold mb-3 xl:mb-4">Table of Contents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      const element = document.getElementById(section.id);
                      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="text-left px-3 py-2 rounded hover:bg-muted transition-colors text-xs xl:text-sm min-h-[44px] flex items-center"
                  >
                    <span className="text-muted-foreground mr-2">{index + 1}.</span>
                    <span className="text-secondary hover:underline">{section.title}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sections */}
          <div className="space-y-4">
            {sections.map((section, index) => {
              const Icon = section.icon;
              const isExpanded = expandedSections.includes(section.id);

              return (
                <Card
                  key={section.id}
                  id={section.id}
                  className="shadow-card scroll-mt-24"
                >
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full p-4 xl:p-6 flex items-center justify-between hover:bg-muted/50 transition-colors min-h-[72px]"
                    >
                      <div className="flex items-center gap-3 xl:gap-4">
                        <div className="flex-shrink-0 w-10 h-10 xl:w-12 xl:h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 xl:h-6 xl:w-6 text-secondary" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs xl:text-sm text-muted-foreground mb-1">
                            Section {index + 1}
                          </div>
                          <h3 className="text-base xl:text-xl font-bold">{section.title}</h3>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 xl:h-6 xl:w-6 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 xl:h-6 xl:w-6 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 xl:px-6 pb-4 xl:pb-6 pt-2 border-t border-border">
                        <div className="space-y-3 xl:space-y-4">
                          {section.content.map((paragraph, pIndex) => (
                            <p
                              key={pIndex}
                              className="text-sm xl:text-base text-muted-foreground leading-relaxed"
                            >
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Footer Note */}
          <Card className="mt-8 shadow-card bg-muted/30">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">
                By using Roomsaathi, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
              <p className="text-sm text-muted-foreground">
                For questions or concerns, please contact us at{' '}
                <a href="mailto:support@roomsaathi.com" className="text-secondary hover:underline">
                  support@roomsaathi.com
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default TermsAndConditions;
