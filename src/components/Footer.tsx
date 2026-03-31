import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const DEFAULT_MISSION = "Equipping women to achieve purpose, fulfillment, and financial stability through meaningful employment and empowerment programs in Somaliland.";
const DEFAULT_ADDRESS = "Hargeisa, Somaliland\nMain Office, Road 1";
const DEFAULT_PHONE = "+252 (0) 63 XXXXXXX";
const DEFAULT_EMAIL = "info@swrc.org";

const Footer: React.FC = () => {
  const [mission, setMission] = useState(DEFAULT_MISSION);
  const [address, setAddress] = useState(DEFAULT_ADDRESS);
  const [phone, setPhone] = useState(DEFAULT_PHONE);
  const [email, setEmail] = useState(DEFAULT_EMAIL);

  useEffect(() => {
    import('../Api/client').then(({ settings }) => {
      settings.get().then((s) => {
        if (s.footer_mission) setMission(s.footer_mission);
        if (s.footer_address) setAddress(s.footer_address);
        if (s.footer_phone) setPhone(s.footer_phone);
        if (s.footer_email) setEmail(s.footer_email);
      }).catch(() => {});
    });
  }, []);

  return (
    <footer className="bg-black text-white pt-16 pb-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Column 1: Logo & Mission */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
            <img src="/logo.png" alt="logo" className="w-full h-full object-cover" />
            </div>
            <div className="leading-tight">
              <h1 className="text-orange-500 font-bold text-lg">Somaliland Women's</h1>
              <p className="text-white font-bold text-sm">Resource Centre</p>
            </div>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
            {mission}
          </p>
          <div className="flex gap-4">
            <a href="https://www.facebook.com/profile.php?id=100081002813069" className="bg-white/10 p-2 rounded-full hover:bg-orange-500 transition"><Facebook size={18} /></a>
            <a href="https://x.com/SomalilandWome2" className="bg-white/10 p-2 rounded-full hover:bg-orange-500 transition"><Twitter size={18} /></a>
            <a href="https://www.instagram.com/p/DVof7nwCBSd/" className="bg-white/10 p-2 rounded-full hover:bg-orange-500 transition"><Instagram size={18} /></a>
            <a href="https://www.linkedin.com/in/lucky-kassim-22005514b?utm_source=share_via&utm_content=profile&utm_medium=member_ios" className="bg-white/10 p-2 rounded-full hover:bg-orange-500 transition"><Linkedin size={18} /></a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-lg font-bold mb-6 border-b border-orange-500/30 pb-2 inline-block">Quick Links</h3>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li><Link to="/" className="hover:text-orange-500 transition">Home</Link></li>
            <li><Link to="/about" className="hover:text-orange-500 transition">About Us</Link></li>
            <li><Link to="/programs" className="hover:text-orange-500 transition">Our Programs</Link></li>
            <li><Link to="/newsletters" className="hover:text-orange-500 transition">Newsletters</Link></li>
            <li><Link to="/blog" className="hover:text-orange-500 transition">Success Stories</Link></li>
            <li><Link to="/contact" className="hover:text-orange-500 transition">Contact Us</Link></li>
          </ul>
        </div>

        {/* Column 3: Programs */}
        <div>
          <h3 className="text-lg font-bold mb-6 border-b border-orange-500/30 pb-2 inline-block">Programs</h3>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li>Employability Training</li>
            <li>Entrepreneurship Support</li>
            <li>Career Mentoring</li>
            <li>Community Workshops</li>
            <li>Alumni Network</li>
          </ul>
        </div>

        {/* Column 4: Contact Info */}
        <div>
          <h3 className="text-lg font-bold mb-6 border-b border-orange-500/30 pb-2 inline-block">Get In Touch</h3>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="text-orange-500 shrink-0 mt-0.5" size={20} />
              <span className="whitespace-pre-line">{address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="text-orange-500 shrink-0" size={20} />
              <span>{phone}</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="text-orange-500 shrink-0" size={20} />
              <span>{email}</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} <a className='font-semibold text-gray-200' href="https://somalifytech.com" target="_blank" rel="noopener noreferrer">Somalify Tech Solutions.</a> All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;