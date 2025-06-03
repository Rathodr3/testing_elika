
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Wrench, 
  Users, 
  Target, 
  Award, 
  Lightbulb, 
  Zap,
  Building,
  Cog,
  TrendingUp
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Wrench,
      title: 'Engineering Services',
      description: 'Comprehensive engineering consulting and technical solutions tailored to your specific industry needs.',
      color: 'bg-blue-500'
    },
    {
      icon: Users,
      title: 'Placement Solutions',
      description: 'Seamless recruitment and placement services connecting top engineering talent with leading companies.',
      color: 'bg-green-500'
    },
    {
      icon: Target,
      title: 'Brand Building',
      description: 'Strategic brand development services to help establish your company as an industry leader.',
      color: 'bg-purple-500'
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'ISO-certified processes ensuring the highest standards in all our engineering deliverables.',
      color: 'bg-orange-500'
    },
    {
      icon: Lightbulb,
      title: 'Innovation Hub',
      description: 'Cutting-edge solutions and innovative approaches to complex engineering challenges.',
      color: 'bg-pink-500'
    },
    {
      icon: Zap,
      title: 'Rapid Deployment',
      description: 'Quick turnaround times with efficient project management and streamlined processes.',
      color: 'bg-yellow-500'
    },
    {
      icon: Building,
      title: 'Enterprise Solutions',
      description: 'Scalable engineering solutions designed for large-scale enterprise implementations.',
      color: 'bg-indigo-500'
    },
    {
      icon: Cog,
      title: 'Technical Consulting',
      description: 'Expert technical guidance and consulting services across multiple engineering disciplines.',
      color: 'bg-red-500'
    },
    {
      icon: TrendingUp,
      title: 'Performance Optimization',
      description: 'Continuous improvement and optimization strategies to maximize operational efficiency.',
      color: 'bg-teal-500'
    }
  ];

  return (
    <section id="services" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl lg:text-5xl font-bold text-secondary-800 mb-6">
              Comprehensive Engineering
              <span className="gradient-text block">Solutions & Services</span>
            </h2>
            <p className="text-xl text-accent max-w-3xl mx-auto leading-relaxed">
              From technical consulting to seamless placements, we provide end-to-end engineering services 
              that drive innovation and deliver exceptional results for your business.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white card-hover group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-secondary-800 mb-4 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-accent leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <span className="text-primary font-medium text-sm hover:underline cursor-pointer">
                      Learn more →
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center px-6 py-3 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              <Zap className="w-4 h-4 mr-2" />
              Ready to partner with us?
            </div>
            <p className="text-accent mb-6">
              Join hundreds of companies that trust Elika Engineering
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary hover:bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Start Your Project
              </button>
              <button className="border-2 border-secondary-800 text-secondary-800 hover:bg-secondary-800 hover:text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105">
                Schedule Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
