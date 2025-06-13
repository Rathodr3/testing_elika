
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServicesHero = () => {
  return (
    <section className="relative bg-gradient-to-b from-white via-slate-100 to-white min-h-screen flex items-center overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Soft Geometric Shapes */}
        <div className="absolute top-10 left-10 w-64 h-64 opacity-30">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(99,91,255,0.2)" strokeWidth="1"/>
            <circle cx="50" cy="50" r="20" fill="none" stroke="rgba(147,51,234,0.15)" strokeWidth="1"/>
            <circle cx="50" cy="50" r="10" fill="rgba(99,91,255,0.1)"/>
          </svg>
        </div>
        
        <div className="absolute bottom-20 right-20 w-80 h-80 opacity-25">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="rgba(147,51,234,0.2)" strokeWidth="1"/>
            <polygon points="50,25 75,50 50,75 25,50" fill="rgba(99,91,255,0.08)"/>
          </svg>
        </div>

        <div className="absolute top-1/3 right-1/4 w-48 h-48 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <rect x="20" y="20" width="60" height="60" rx="10" fill="none" stroke="rgba(99,91,255,0.15)" strokeWidth="1"/>
            <rect x="35" y="35" width="30" height="30" rx="5" fill="rgba(147,51,234,0.1)"/>
          </svg>
        </div>

        {/* Floating Dots */}
        <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-primary/20 rounded-full animate-float"></div>
        <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-purple-400/25 rounded-full animate-float delay-1000"></div>
        <div className="absolute top-2/3 right-1/3 w-4 h-4 bg-primary/15 rounded-full animate-float delay-500"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="text-left">
              {/* Badge */}
              <div className="inline-flex items-center px-6 py-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 text-primary rounded-full text-sm font-semibold mb-8 shadow-sm">
                <div className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></div>
                Our Services
              </div>

              {/* Main Title */}
              <h1 className="text-6xl lg:text-8xl font-semibold text-slate-700 mb-6 leading-tight">
                <span className="block">Services</span>
                <span className="block text-slate-500">We Offer</span>
              </h1>

              {/* Subtitle */}
              <p className="text-2xl lg:text-3xl text-slate-600 font-medium mb-8 leading-relaxed">
                Industry leading Specialists in Engineering Solutions, IT service, Training, & Staff Augmentation.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary text-white hover:bg-primary/90 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-primary/20 hover:border-primary/30"
                  onClick={() => document.getElementById('services-content')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Services
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-400 font-semibold px-8 py-4 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                >
                  <Link to="/contact" className="flex items-center">
                    Get Started
                    <Mail className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Content - Single Hero Image */}
            <div className="relative">
              {/* Main Hero Image */}
              <div className="relative overflow-hidden rounded-3xl shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-500 bg-white/95 backdrop-blur-lg border border-white/30">
                <img 
                  src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&h=500&fit=crop"
                  alt="Engineering Services"
                  className="w-full h-96 object-cover"
                />
                
                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                
                {/* Image Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-2xl font-bold mb-2">Professional Services</h3>
                  <p className="text-white/90 text-lg">Engineering • IT Solutions • Training • Staffing</p>
                </div>

                {/* Floating Badge */}
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-lg rounded-2xl px-4 py-2 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-gray-900">Expert Solutions</span>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/40 rounded-full backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-md">
                <Settings className="w-8 h-8 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform duration-300" onClick={() => document.getElementById('services-content')?.scrollIntoView({ behavior: 'smooth' })}>
          <span className="text-slate-500 text-sm mb-3 font-medium">Explore More</span>
          <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center hover:border-primary transition-colors duration-300">
            <div className="w-1 h-3 bg-slate-500 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesHero;
