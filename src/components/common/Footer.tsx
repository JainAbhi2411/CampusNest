import React from "react";
import { Link } from "react-router-dom";
import { Building2, Mail, Phone, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-primary text-primary-foreground border-t border-primary-light isolate">
      <div className="max-w-7xl mx-auto py-8 xl:py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3 xl:mb-4">
              <img
  src="/images/logo/roomsaathilogo.png"
  alt="Roomsaathi Logo"
  className="h-14 xl:h-16 w-auto scale-125 origin-left"
 />
                <img
  src="/images/logo/roomsaathilogo.png"
  alt="Roomsaathi Logo"
  loading="eager"
  className="h-30 xl:h-30 w-auto max-w-none"
 />
            </div>
            <p className="text-sm xl:text-base text-primary-foreground/80 mb-3 xl:mb-4">
              Your trusted companion for finding the perfect student accommodation. 
              We connect students with quality PGs, flats, hostels, and rooms near their campus.
            </p>
            <div className="flex gap-3 xl:gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-secondary transition-smooth"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4 xl:h-5 xl:w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-secondary transition-smooth"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4 xl:h-5 xl:w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-secondary transition-smooth"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 xl:h-5 xl:w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-secondary transition-smooth"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4 xl:h-5 xl:w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-base xl:text-lg font-semibold mb-3 xl:mb-4">Quick Links</h3>
            <div className="text-sm xl:text-base text-primary-foreground/80 space-y-2">
              <Link to="/properties" className="block hover:text-secondary transition-smooth">
                Find Properties
              </Link>
              <Link to="/mess" className="block hover:text-secondary transition-smooth">
                Mess Facilities
              </Link>
              <a 
                href="https://rosamanage.netlify.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block hover:text-secondary transition-smooth"
              >
                List Your Property
              </a>
              <Link to="/about" className="block hover:text-secondary transition-smooth">
                About Us
              </Link>
              <Link to="/blog" className="block hover:text-secondary transition-smooth">
                Blog
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-base xl:text-lg font-semibold mb-3 xl:mb-4">Contact Us</h3>
            <div className="text-sm xl:text-base text-primary-foreground/80 space-y-2 xl:space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 xl:h-4 xl:w-4 text-secondary flex-shrink-0" />
                <a href="tel:+917374035907" className="hover:text-secondary transition-smooth">
                  +91 7374035907
                </a>
                 <a href="tel:+917374035907" className="hover:text-secondary transition-smooth">
                  +91 8000706380
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 xl:h-4 xl:w-4 text-secondary flex-shrink-0" />
                <a href="mailto:roomsaathi@gmail.com" className="hover:text-secondary transition-smooth break-all">
                  roomsaathi@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base xl:text-lg font-semibold mb-3 xl:mb-4">Support Hours</h3>
            <div className="text-sm xl:text-base text-primary-foreground/80 space-y-1 xl:space-y-2 mb-3 xl:mb-4">
              <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
              <p>Saturday: 10:00 AM - 6:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
            <Link to="/terms" className="text-sm text-primary-foreground/80 hover:text-secondary transition-smooth">
              Terms & Conditions
            </Link>
          </div>
        </div>

        <div className="mt-6 xl:mt-8 pt-6 xl:pt-8 border-t border-primary-light text-center text-sm xl:text-base text-primary-foreground/80">
          <p>© {currentYear} Roomsaathi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
