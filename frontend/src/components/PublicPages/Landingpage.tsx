import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../shared/Button';
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  blurIn
} from '../../utils/animations';
import {
  Home,
  Sparkles,
  ShieldCheck,
  Search,
  MessageSquare,
  Building2,
  Instagram,
  Twitter,
  Linkedin,
  Github
} from 'lucide-react';
import { ParticleGrid } from '../shared/ParticleGrid';
import { ScrollCard } from '../shared/ScrollCard';
import './LandingPage.css';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Sparkles className="feature-icon-svg" />,
      title: 'AI-Powered Matching',
      description: 'Our intelligent algorithm analyzes compatibility to find your perfect roommate match.'
    },
    {
      icon: <ShieldCheck className="feature-icon-svg" />,
      title: 'Safety First',
      description: 'Red flag detection and verification system to ensure your safety and peace of mind.'
    },
    {
      icon: <Search className="feature-icon-svg" />,
      title: 'Smart Housing Search',
      description: 'Find the perfect place with AI-driven recommendations based on your preferences.'
    },
    {
      icon: <MessageSquare className="feature-icon-svg" />,
      title: 'Seamless Communication',
      description: 'Chat with potential roommates and get AI-powered icebreaker suggestions.'
    }
  ];

  const stats = [
    { value: '1K+', label: 'Active Users' },
    { value: '98%', label: 'Match Confidence' },
    { value: '5+', label: 'Prime Cities' },
    { value: '24/7', label: 'AI Support' }
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Your Profile',
      description: 'Tell our AI about your lifestyle, habits, and what makes you a great roommate.'
    },
    {
      number: '02',
      title: 'AI Analysis',
      description: 'Our matching engine processes thousands of data points to find your highest-compatibility matches.'
    },
    {
      number: '03',
      title: 'Connect & Move In',
      description: 'Chat with matches using AI icebreakers and find your perfect new home together.'
    }
  ];

  return (
    <div className="landing-page">
      <ParticleGrid />
      {/* Navigation */}
      <motion.nav
        className="landing-nav glass"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container">
          <div className="nav-content">
            <div className="nav-logo">
              <Home className="logo-icon-svg" />
              <span className="logo-text gradient-text">RoomEase</span>
            </div>
            <div className="nav-actions">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login-selection')}
              >
                Login
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/user-signup')}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="hero-section mesh-bg">
        <div className="container">
          <motion.div
            className="hero-content"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="hero-badge" variants={fadeInUp}>
              <span className="badge-icon">✨</span>
              <span>AI-Powered Roommate Matching</span>
            </motion.div>

            <motion.h1 className="hero-title" variants={blurIn}>
              Find Your Perfect
              <br />
              <span className="gradient-text">Roommate Match</span>
            </motion.h1>

            <motion.p className="hero-subtitle" variants={blurIn}>
              Let our intelligent AI find compatible roommates and ideal housing
              <br />
              based on your lifestyle, preferences, and budget.
            </motion.p>

            <motion.div className="hero-actions" variants={fadeInUp}>
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/user-signup')}
              >
                Start Matching Now
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => navigate('/login-selection')}
              >
                Learn More
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="hero-stats"
              variants={staggerContainer}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="stat-item"
                  variants={staggerItem}
                >
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-title">Why Choose RoomEase?</h2>
            <p className="section-subtitle">
              Powered by advanced AI to make roommate finding effortless and safe
            </p>
          </motion.div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <ScrollCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="how-it-works-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Three simple steps to your dream roommate situation</p>
          </motion.div>

          <div className="steps-grid">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="step-card glass"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="step-number">{step.number}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
                <div className="step-connector" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & Trust Section */}
      <section className="safety-section">
        <div className="container">
          <div className="safety-content">
            <motion.div
              className="safety-text"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="safety-badge">
                <ShieldCheck size={16} />
                <span>Verified Community</span>
              </div>
              <h2 className="section-title">Your Safety is Our Top Priority</h2>
              <p className="section-subtitle" style={{ textAlign: 'left', margin: '0' }}>
                We've built a multi-layered security system to ensure you can find your next home with complete peace of mind.
              </p>
              <ul className="safety-list">
                <li>
                  <Sparkles size={18} className="list-icon" />
                  <span>AI-powered "Red Flag" detection in profiles and chats</span>
                </li>
                <li>
                  <ShieldCheck size={18} className="list-icon" />
                  <span>Mandatory ID verification for all premium members</span>
                </li>
                <li>
                  <Building2 size={18} className="list-icon" />
                  <span>Property listing verification to prevent rental scams</span>
                </li>
              </ul>
            </motion.div>
            <motion.div
              className="safety-visual-box glass"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="trust-meter">
                <div className="trust-circle">
                  <span className="trust-percent">99%</span>
                  <span className="trust-label">Safe Matches</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="cta-section gradient-primary">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Interactive decorative blobs */}
            <motion.div
              className="cta-blob"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
                x: [0, 50, 0]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />

            <h2 className="cta-title">Ready to Find Your Perfect Match?</h2>
            <p className="cta-subtitle">
              Join thousands of users who found their ideal roommates with RoomEase
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/user-signup')}
                className="cta-button-glow"
              >
                Get Started for Free
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <Home className="footer-logo-svg" />
              <span className="logo-text">RoomEase</span>
            </div>

            <div className="footer-socials">
              {[Instagram, Twitter, Linkedin, Github].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  className="social-icon-link"
                  whileHover={{
                    scale: 1.2,
                    y: -5,
                    color: "var(--color-primary)"
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>

            <p className="footer-text">
              © {new Date().getFullYear()} RoomEase. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};