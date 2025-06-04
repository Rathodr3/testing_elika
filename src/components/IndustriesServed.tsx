import React from 'react';
import { Laptop, Car, Cog, Smartphone, Plane, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Section from './Section';
import SectionHeader from './SectionHeader';
import Grid from './Grid';
import EnhancedCard from './EnhancedCard';
import { Button } from '@/components/ui/button';

const IndustriesServed = () => {
  const industries = [
    {
      title: 'Information Technology',
      icon: Laptop,
      description: 'Software development, cloud solutions, and digital transformation services.',
      projects: '150+ Projects',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop'
    },
    {
      title: 'Automobile Industry',
      icon: Car,
      description: 'Automotive engineering, design, and manufacturing solutions.',
      projects: '85+ Projects',
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=200&fit=crop'
    },
    {
      title: 'Engineering & Manufacturing',
      icon: Cog,
      description: 'Industrial automation, process optimization, and manufacturing excellence.',
      projects: '200+ Projects',
      image: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400&h=200&fit=crop'
    },
    {
      title: 'Telecom Industry',
      icon: Smartphone,
      description: 'Network infrastructure, 5G solutions, and telecommunications services.',
      projects: '75+ Projects',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop'
    },
    {
      title: 'Aerospace & Aviation',
      icon: Plane,
      description: 'Aerospace engineering, aviation systems, and defense technologies.',
      projects: '45+ Projects',
      image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400&h=200&fit=crop'
    },
    {
      title: 'Healthcare Industry',
      icon: Heart,
      description: 'Medical technology, healthcare IT, and biomedical engineering solutions.',
      projects: '60+ Projects',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=200&fit=crop'
    }
  ];

  const handleContactClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <Section background="white">
      <SectionHeader
        subtitle="Industries We Serve"
        title="Diverse Industry Expertise"
        description="At Elika Engineering Pvt. Ltd., we deliver tailored engineering services and customer solutions across diverse industries, empowering businesses to excel with innovation, efficiency, and reliable support."
      />

      <Grid cols={3} gap="lg" className="mb-20">
        {industries.map((industry, index) => (
          <EnhancedCard
            key={index}
            title={industry.title}
            description={industry.description}
            image={industry.image}
            icon={industry.icon}
            features={[industry.projects]}
            className="group"
          />
        ))}
      </Grid>

      {/* Contact Section */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-secondary-800 mb-4">
            Let's Talk About Your Needs
          </h3>
          <p className="text-lg text-accent mb-6">
            See how our innovative engineering services can bring value to your project.
          </p>
          <Link to="/contact" onClick={handleContactClick}>
            <Button size="lg" className="hover:scale-105 transition-transform duration-300">
              Contact Us Today
            </Button>
          </Link>
        </div>
      </div>
    </Section>
  );
};

export default IndustriesServed;
