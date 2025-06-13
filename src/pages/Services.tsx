
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import ServicesHero from '@/components/services/ServicesHero';
import ServicesTagline from '@/components/services/ServicesTagline';
import MainServices from '@/components/services/MainServices';
import ServiceFeatures from '@/components/services/ServiceFeatures';

const Services = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-6">
        <ServicesHero />
        <div id="services-content">
          <ServicesTagline />
          <MainServices />
          <ServiceFeatures />
        </div>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Services;
