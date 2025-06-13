
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Code, Database, Wrench, UserPlus, BookOpen, Award } from 'lucide-react';

const ServiceFeatures = () => {
  const features = [
    {
      icon: Code,
      title: 'Technical Expertise',
      description: 'Deep knowledge across multiple engineering disciplines and cutting-edge technologies.'
    },
    {
      icon: Database,
      title: 'Data-Driven Solutions',
      description: 'Leveraging analytics and insights to deliver optimized engineering solutions.'
    },
    {
      icon: Wrench,
      title: 'Custom Development',
      description: 'Tailored engineering solutions designed specifically for your unique requirements.'
    },
    {
      icon: UserPlus,
      title: 'Talent Acquisition',
      description: 'Connecting you with top-tier engineering talent across various specializations.'
    },
    {
      icon: BookOpen,
      title: 'Continuous Learning',
      description: 'Ongoing training and development programs to keep your team ahead of the curve.'
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'Rigorous quality control processes ensuring excellence in every project delivery.'
    }
  ];

  return (
    <section className="py-8 lg:py-12 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              Why Choose Us
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-8">
              Why Choose Our Services?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We deliver comprehensive solutions that drive growth, optimize operations, and ensure lasting success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white group text-center rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceFeatures;
