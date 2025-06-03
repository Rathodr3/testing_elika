
import React from 'react';
import { CheckCircle, Target, Users, Zap } from 'lucide-react';

const WelcomeSection = () => {
  const features = [
    {
      icon: Target,
      title: "Precision Engineering",
      description: "Delivering exact solutions tailored to your specific needs"
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Skilled professionals with years of industry experience"
    },
    {
      icon: Zap,
      title: "Fast Delivery",
      description: "Quick turnaround times without compromising quality"
    },
    {
      icon: CheckCircle,
      title: "Quality Assured",
      description: "Rigorous testing and validation processes"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
            Welcome to Excellence
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            WELCOME TO 
            <span className="block bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              ELIKA ENGINEERING
            </span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Where we blend authenticity and innovation in recruitment and engineering 
            services. Our mission is simple: to transform the industry through authentic, 
            honest solutions tailored to your needs.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Bottom Content */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Building Lasting Relationships
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                We're not just another recruitment agency or engineering consultancy. We're a team of 
                dedicated professionals who prioritize building lasting relationships and delivering 
                solutions that truly make a difference.
              </p>
              <p className="text-gray-600 leading-relaxed">
                In this space, genuine connections replace idle pitches, and integrity prevails in 
                entirely innovative excellence. Welcome to Elika Engineering Pvt. Ltd., where your 
                success is our priority.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&q=80"
                alt="Professional workspace"
                className="w-full h-80 object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
