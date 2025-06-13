
import React from 'react';
import { Cog, Users, GraduationCap, Monitor } from 'lucide-react';
import Section from './Section';
import SectionHeader from './SectionHeader';
import Grid from './Grid';
import EnhancedCard from './EnhancedCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ServicesOverview = () => {
  const handleScrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const services = [
    {
      icon: Cog,
      title: 'Engineering Solutions',
      description: 'Unlocking innovative solutions for diverse client needs with cutting-edge technology and expertise.',
      image: '/lovable-uploads/EngineeringSolutions.jpg?w=400&h=250&fit=crop',
    },
    {
      icon: Users,
      title: 'Human Resource Services', 
      description: 'Effective staff augmentation is the key for high growth tech companies. We find the perfect talent for your team.',
      image: '/lovable-uploads/HumanResourceServices.jpg?w=400&h=250&fit=crop',
    },
    {
      icon: GraduationCap,
      title: 'Training & Development',
      description: 'Continuous learning drives growth, adaptability, and sustained success in today\'s evolving landscape.',
      image: '/lovable-uploads/Training.jpg?w=400&h=250&fit=crop',
    },
    {
      icon: Monitor,
      title: 'IT Services',
      description: 'Comprehensive technology solutions including software development, cloud services, and digital transformation.',
      image: '/lovable-uploads/IT.jpg?w=400&h=250&fit=crop',
    }
  ];

  return (
    <Section background="gradient">
      <SectionHeader
        subtitle="BRINGING CHANGE TO THE ENGINEERING SERVICES INDUSTRY"
        title="Comprehensive Engineering Solutions"
        description="At Elika Engineering Pvt Ltd, we are dedicated to providing innovative and reliable solutions that support businesses across IT, Automobile, and Engineering sectors. From specialized management solutions to cutting-edge engineering services, we aim to be your strategic partner in achieving success and efficiency in every project."
      />

      <Grid cols={4} gap="lg" className="mb-16">
        {services.map((service, index) => (
          <div key={index} className="group h-full flex flex-col justify-between">
            <EnhancedCard
              title={service.title}
              description={service.description}
              image={service.image}
              icon={service.icon}
              buttonText=""
              className="h-full"
            />
            <div className="mt-2">
              <Link to="/services" onClick={handleScrollToTop}>
                <Button className="w-full">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </Grid>
    </Section>
  );
};

export default ServicesOverview;
