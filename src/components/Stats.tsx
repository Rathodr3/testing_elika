
import React, { useState, useEffect, useRef } from 'react';

const Stats = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const stats = [
    {
      value: '500+',
      label: 'Projects Completed',
      description: 'Across diverse industries'
    },
    {
      value: '150+',
      label: 'Engineers Placed',
      description: 'In leading companies'
    },
    {
      value: '50+',
      label: 'Partner Companies',
      description: 'Trusted relationships built'
    },
    {
      value: '90%',
      label: 'Success Rate',
      description: 'Client satisfaction guaranteed'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 lg:py-32 bg-secondary-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary via-transparent to-transparent"></div>
        <div className="absolute top-20 left-20 w-64 h-64 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 border border-white/10 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Delivering Results That
              <span className="text-primary block">Speak for Themselves</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Our track record demonstrates our commitment to excellence in engineering services, 
              placement solutions, and building lasting partnerships with our clients.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className={`text-center group transition-all duration-700 ${
                  isVisible ? 'animate-fade-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-primary/30 transition-all duration-300 hover:bg-white/10 group-hover:scale-105">
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300">
                    {stat.value}
                  </div>
                  <div className="text-lg font-semibold text-gray-300 mb-2">
                    {stat.label}
                  </div>
                  <div className="text-sm text-gray-400">
                    {stat.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center space-x-8 text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm">ISO Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Global Reach</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
