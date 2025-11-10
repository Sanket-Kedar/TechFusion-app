import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">TechFusion</h3>
            <p className="text-sm mb-4">
              Your one-stop shop for premium electronics and technology products.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-primary-400 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=Laptops" className="hover:text-primary-400 transition-colors">
                  Laptops
                </Link>
              </li>
              <li>
                <Link to="/products?category=Smartphones" className="hover:text-primary-400 transition-colors">
                  Smartphones
                </Link>
              </li>
              <li>
                <Link to="/products?category=Accessories" className="hover:text-primary-400 transition-colors">
                  Accessories
                </Link>
              </li>
              <li>
                <Link to="/products?category=Gaming" className="hover:text-primary-400 transition-colors">
                  Gaming
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <MapPin size={18} />
                <span className="text-sm">Hinjewadi, Pune, Maharashtra 411057, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} />
                <span className="text-sm">+91 20 1234 5678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} />
                <span className="text-sm">support@techfusion.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} TechFusion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
