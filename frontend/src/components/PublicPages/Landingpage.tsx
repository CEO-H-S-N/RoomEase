import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Plus, Star, MapPin, Search, ShieldCheck, MessageSquare } from 'lucide-react';
import { ParticleGrid } from '../shared/ParticleGrid';
import './LandingPage.css';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeCard, setActiveCard] = useState<number>(3); // Center card index (1-based, 3 is middle of 5)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard(prev => (prev % 5) + 1);
    }, 3000); // Rotate every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const toggleFaq = (index: number) => {
    if (activeFaq === index) {
      setActiveFaq(null);
    } else {
      setActiveFaq(index);
    }
  };

  const faqs = [
    { question: "How does the AI matching work?", answer: "Our AI analyzes your preferences, habits, and lifestyle to suggest the best roommate matches." },
    { question: "Is my personal data secure?", answer: "Yes, we use advanced encryption and strict privacy protocols to protect your information." },
    { question: "Can I list my own property?", answer: "Absolutely. RoomEase allows property owners to list and manage their rentals easily." },
    { question: "Are background checks included?", answer: "Yes, we offer integrated background checks for premium users to ensure safety." },
  ];

  const carouselFeatures = [
    { id: 1, title: 'AI Matching', icon: <Sparkles size={32} color="#EF7A25" />, desc: 'Algorithm-based roommate pairings.' },
    { id: 2, title: 'Verified Profiles', icon: <ShieldCheck size={32} color="#EF7A25" />, desc: 'Mandatory ID checks for peace of mind.' },
    { id: 3, title: 'Smart Search', icon: <Search size={32} color="#EF7A25" />, desc: 'Filter by lifestyle, budget, and location.' },
    { id: 4, title: 'Secure Chat', icon: <MessageSquare size={32} color="#EF7A25" />, desc: 'In-app messaging to keep your number private.' },
    { id: 5, title: 'Map View', icon: <MapPin size={32} color="#EF7A25" />, desc: 'Interactive geographic property exploration.' },
  ];

  return (
    <div className="landing-page">
      <ParticleGrid />
      
      {/* Navigation */}
      <nav className="landing-nav-ref">
        <div className="nav-logo">RoomEase</div>
        <div className="nav-actions">
          <button className="btn-ref-outline" onClick={() => navigate('/login-selection')}>Log in</button>
          <button className="btn-ref-solid" onClick={() => navigate('/user-signup')}>Get started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-split">
        <div className="hero-left">
          <div className="hero-text-content">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8 }}
            >
              <Star size={24} color="#3A2618" style={{ marginBottom: '1rem' }} />
              <h1>Find your perfect living space.</h1>
              <p>Your path to better housing and roommates starts here. Smart matching, verified listings, zero stress.</p>
              <button className="pill-btn" onClick={() => navigate('/user-signup')}>
                Start your journey <Sparkles size={18} />
              </button>
            </motion.div>
          </div>
        </div>
        <div className="hero-right">
          {/* Background image handled in CSS */}
        </div>
      </section>

      {/* Section 2: Dark Arc */}
      <motion.section 
        className="dark-arc-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="arc-graphic-container">
          <motion.div 
            className="arc-graphic"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <motion.div 
          className="arc-content"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2>24/7 support for finding your next home.</h2>
        </motion.div>
      </motion.section>

      {/* Section 3: Radiant Gradient & Mock UI */}
      <motion.section 
        className="radiant-section" 
        style={{ position: 'relative', overflow: 'hidden' }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        {/* Flair Orbs */}
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
          style={{ position: 'absolute', top: '10%', left: '10%', width: 100, height: 100, borderRadius: '50%', background: '#EF7A25', filter: 'blur(40px)' }}
        />
        <motion.div 
          animate={{ y: [0, 30, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 7, repeat: Infinity }}
          style={{ position: 'absolute', bottom: '20%', right: '10%', width: 150, height: 150, borderRadius: '50%', background: '#F6C141', filter: 'blur(50px)' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="radiant-title">The future of renting is proactive.</h2>
          <p className="radiant-subtitle">We don't just show you listings. We use smart algorithms to actively match you with the people and places you'll love.</p>
        </motion.div>

        <div className="ui-mockups">
          <motion.div 
            className="floating-ui-card"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            drag
            dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
            whileHover={{ scale: 1.05, cursor: 'grab' }}
            whileTap={{ cursor: 'grabbing' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div className="ui-avatar" style={{ background: '#FFCBA4' }}></div>
              <div>
                <strong>Sarah Jenkins</strong><br/>
                <small style={{ color: '#666' }}>98% Match Compatibility</small>
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#444' }}>"I love cooking, keeping common areas clean, and early morning runs."</p>
          </motion.div>

          <motion.div 
            className="floating-ui-card"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            drag
            dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
            whileHover={{ scale: 1.05, cursor: 'grab' }}
            whileTap={{ cursor: 'grabbing' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <MapPin size={20} color="#EF7A25" style={{ marginRight: '10px' }} />
              <div>
                <strong>Luxury Apartment F-8</strong><br/>
                <small style={{ color: '#666' }}>Islamabad • Verified Listing</small>
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#444', fontWeight: 'bold' }}>Rs. 120,000 / month</p>
          </motion.div>
        </div>

        <div className="faces-row">
          {[1,2,3,4].map((i) => (
            <motion.div 
              className="face-card" 
              key={i}
              whileHover={{ y: -10 }}
            >
              <img src={`https://i.pravatar.cc/150?img=${10+i}`} alt="User" />
              <h4>Happy User</h4>
              <p>Found a roommate in 3 days.</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Section 4: Dark Split Glow */}
      <motion.section 
        className="dark-split-glow"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2>The future of living is here.</h2>
        <div className="split-glow-container">
          <div className="glow-divider"></div>
          
          <div className="pricing-col left">
            <h3 style={{ marginBottom: '2rem', color: '#ccc' }}>For Renters</h3>
            <motion.div className="pricing-pill" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Smart Matching</motion.div><br/>
            <motion.div className="pricing-pill" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Verified Profiles</motion.div><br/>
            <motion.div className="pricing-pill active" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Secure Chat</motion.div>
          </div>
          
          <div className="pricing-col right">
            <h3 style={{ marginBottom: '2rem', color: '#ccc' }}>For Owners</h3>
            <motion.div className="pricing-pill" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Property Listing</motion.div><br/>
            <motion.div className="pricing-pill active" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Tenant Screening</motion.div><br/>
            <motion.div className="pricing-pill" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Premium Support</motion.div>
          </div>
        </div>
      </motion.section>

      {/* Section 5: Cards Carousel */}
      <motion.section 
        className="cards-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="carousel-title" style={{ fontSize: '3rem', color: '#fff', marginBottom: '1rem', fontFamily: 'serif', textShadow: '0 4px 15px rgba(0,0,0,0.5)', position: 'relative', zIndex: 2 }}>Better living,<br/>by design.</h2>
        <p style={{ color: '#eee', marginBottom: '2rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)', position: 'relative', zIndex: 2 }}>Everything you need in one platform.</p>
        
        <div className="cards-container">
          {carouselFeatures.map((feature) => {
            // Calculate z-index and scale based on distance from activeCard
            const distance = Math.abs(activeCard - feature.id);
            let scale = 1;
            let translateZ = 0;
            let zIndex = 10 - distance;
            let opacity = 1;

            if (distance === 0) {
              scale = 1.1;
              translateZ = 50;
            } else if (distance === 1) {
              scale = 0.9;
              translateZ = 0;
              opacity = 0.8;
            } else {
              scale = 0.8;
              translateZ = -50;
              opacity = 0.6;
            }

            return (
              <motion.div 
                className="overlap-card" 
                key={feature.id}
                onClick={() => setActiveCard(feature.id)}
                animate={{
                  scale,
                  z: translateZ,
                  zIndex,
                  opacity
                }}
                transition={{ duration: 0.4, type: 'spring' }}
                style={{ cursor: 'pointer' }}
                whileHover={{ y: -10 }}
              >
                <div style={{ marginBottom: '1rem' }}>{feature.icon}</div>
                <h4 style={{ marginBottom: '0.5rem' }}>{feature.title}</h4>
                <p style={{ fontSize: '0.8rem', color: '#666' }}>{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Section 6: FAQ */}
      <motion.section 
        className="faq-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 style={{ fontSize: '2.5rem', fontFamily: 'serif', marginBottom: '2rem' }}>A common language to make renting simple.</h2>
        
        <div className="faq-list">
          {faqs.map((faq, idx) => (
            <div className="faq-item" key={idx} onClick={() => toggleFaq(idx)}>
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>{faq.question}</h3>
                  <div className="plus-icon">
                    {activeFaq === idx ? <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>-</span> : <Plus size={16} />}
                  </div>
                </div>
                {activeFaq === idx && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }}
                    style={{ marginTop: '1rem', color: '#555', fontSize: '1rem' }}
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      <footer className="landing-footer-ref">
        <p>© {new Date().getFullYear()} RoomEase. All rights reserved.</p>
      </footer>
    </div>
  );
};