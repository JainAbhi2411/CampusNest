import React from "react";
import { Building2, Mail, Phone, MapPin } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground border-t border-primary-light">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-6 w-6 text-secondary" />
              <h3 className="text-lg font-semibold">StayNearby</h3>
            </div>
            <p className="text-primary-foreground/80">
              Your trusted platform for finding the perfect student accommodation. 
              We connect students with quality PGs, flats, hostels, and rooms near their campus.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="text-primary-foreground/80 space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-secondary" />
                <p>Student Housing District, University Area</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-secondary" />
                <p>+1 (555) 123-4567</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-secondary" />
                <p>support@staynearby.com</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support Hours</h3>
            <div className="text-primary-foreground/80 space-y-2">
              <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
              <p>Saturday: 10:00 AM - 6:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-light text-center text-primary-foreground/80">
          <p>{currentYear} StayNearby</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
