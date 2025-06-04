
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import ServicesOverview from '@/components/ServicesOverview';
import IndustriesServed from '@/components/IndustriesServed';
import WelcomeSection from '@/components/WelcomeSection';
import Testimonials from '@/components/Testimonials';
import FeaturedJobs from '@/components/FeaturedJobs';
import Newsletter from '@/components/Newsletter';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="relative">
        <Hero />
        <WelcomeSection />
        <ServicesOverview />
        <FeaturedJobs />
        <IndustriesServed />
        <Testimonials />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Index;
