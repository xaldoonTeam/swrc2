import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    alert('Waad ku mahadsantahay xiriirkaaga! Dhakhso ayaan kuugu soo jawaabi doonaa.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="bg-[#2D241E] py-20 px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto space-y-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold">Get In Touch</h1>
          <p className="text-gray-400 text-lg">
            Ma haysaa su'aal ama ma u baahantahay caawinaad? Fadlan nala soo xiriir, kooxdayadu waxay diyaar u tahay inay ku caawiso.
          </p>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 -mt-10">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* 1. Contact Info Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1 bg-orange-500 rounded-lg  p-10 text-white space-y-10 shadow-xl"
          >
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Contact Information</h2>
              <p className="text-orange-100 italic">"Coming together is a beginning; keeping together is progress; working together is success."</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-2 rounded"><Phone size={20} /></div>
                <div>
                  <p className="text-xs text-orange-200 uppercase font-bold tracking-widest">Call Us</p>
                  <p className="font-semibold">+252 63 XXXXXXX</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-2 rounded"><Mail size={20} /></div>
                <div>
                  <p className="text-xs text-orange-200 uppercase font-bold tracking-widest">Email Us</p>
                  <p className="font-semibold">info@swrc.org</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-2 rounded"><MapPin size={20} /></div>
                <div>
                  <p className="text-xs text-orange-200 uppercase font-bold tracking-widest">Location</p>
                  <p className="font-semibold">Hargeisa, Somaliland</p>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-white/20">
              <p className="text-sm font-bold mb-4 uppercase tracking-widest">Follow Us</p>
              <div className="flex gap-4">
                <a href="#" className="bg-white/20 p-2 rounded hover:bg-white hover:text-orange-500 transition"><Facebook size={20} /></a>
                <a href="#" className="bg-white/20 p-2 rounded hover:bg-white hover:text-orange-500 transition"><Twitter size={20} /></a>
                <a href="#" className="bg-white/20 p-2 rounded hover:bg-white hover:text-orange-500 transition"><Instagram size={20} /></a>
                <a href="#" className="bg-white/20 p-2 rounded hover:bg-white hover:text-orange-500 transition"><Linkedin size={20} /></a>
              </div>
            </div>
          </motion.div>

          {/* 2. Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-white rounded-lg p-8 md:p-12 shadow-2xl shadow-gray-100 border border-gray-100"
          >
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Your Name</label>
                <input 
                  type="text" name="name" required value={formData.name} onChange={handleChange}
                  placeholder="Lucky Kassim"
                  className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" name="email" required value={formData.email} onChange={handleChange}
                  placeholder="example@mail.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Subject</label>
                <input 
                  type="text" name="subject" required value={formData.subject} onChange={handleChange}
                  placeholder="How can we help?"
                  className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Message</label>
                <textarea 
                  name="message" rows={5} required value={formData.message} onChange={handleChange}
                  placeholder="Write your message here..."
                  className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                ></textarea>
              </div>

              <div className="md:col-span-2 pt-4">
                <button 
                  type="submit"
                  className="bg-orange-500 text-white px-10 py-3 rounded font-bold flex items-center justify-center gap-3 hover:bg-orange-600 hover:shadow-lg transition-all active:scale-95 w-full md:w-auto"
                >
                  Send Message <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>

        </div>
      </section>

      {/* Map Section - Hargeisa, Somaliland */}
      <section className="px-6 md:px-12 pb-20">
        <div className="max-w-7xl mx-auto h-[400px] rounded overflow-hidden shadow-lg border border-gray-200 relative">
          <iframe
            title="SWRC Location - Hargeisa, Somaliland"
            src="https://www.openstreetmap.org/export/embed.html?bbox=44.00%2C9.52%2C44.13%2C9.60&layer=mapnik&marker=9.56%2C44.065"
            className="absolute inset-0 w-full h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <a
            href="https://www.openstreetmap.org/?mlat=9.56&mlon=44.065#map=14/9.56/44.065"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 right-3 bg-white px-4 py-2 rounded shadow-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
          >
            <MapPin size={18} className="text-orange-500" />
            Open in Maps
          </a>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;