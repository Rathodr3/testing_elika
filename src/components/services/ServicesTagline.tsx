
import React from 'react';

const ServicesTagline = () => {
  return (
    <section className="py-8 lg:py-12 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(99,91,255,0.1),transparent_60%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(147,51,234,0.1),transparent_60%)]"></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-10 left-10 w-24 h-24 border-2 border-primary/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-3xl rotate-45"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-primary/5 rounded-full"></div>
        <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-primary/20 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/3 w-12 h-12 bg-purple-400/10 rounded-full blur-sm"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Explore our 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-600 to-blue-600"> services</span>
          </h2>
          <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Welcome to our world of innovation and expertise. Dive into a realm where engineering solutions, IT services, and staff augmentation services converge to redefine possibilities.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ServicesTagline;
