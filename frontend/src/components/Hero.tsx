
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Section from './Section';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = [
      { ref: titleRef, delay: 200 },
      { ref: subtitleRef, delay: 400 },
      { ref: ctaRef, delay: 600 },
      { ref: statsRef, delay: 800 }
    ];

    const timer = setTimeout(() => {
      elements.forEach(({ ref, delay }) => {
        if (ref.current) {
          setTimeout(() => {
            ref.current?.classList.add('visible');
          }, delay);
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleNavigateClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <Section 
      spacing="xl" 
      background="white" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
        
        {/* Floating Shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-xl animate-float delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-xl animate-float delay-500"></div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="text-left">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-8 animate-fade-in">
              <Star className="w-4 h-4 mr-2 fill-current" />
              Engineering Excellence Since 2024
            </div>

            {/* Main Headline */}
            <h1 
              ref={titleRef}
              className="fade-in-up text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Elevating
              <span className="block bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Success
              </span>
              Together
            </h1>
            
            {/* Subtitle */}
            <p 
              ref={subtitleRef}
              className="fade-in-up delay-200 text-xl text-gray-600 mb-8 leading-relaxed max-w-lg"
            >
              We transform businesses through innovative engineering solutions and strategic talent acquisition, delivering excellence at every step.
            </p>

            {/* CTA Buttons */}
            <div 
              ref={ctaRef}
              className="fade-in-up delay-300 flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Link to="/about" onClick={handleNavigateClick}>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary-600 hover:to-purple-700 text-white px-8 py-4 h-auto text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 h-auto text-lg font-semibold rounded-xl hover:scale-105 transition-all duration-300"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div 
              ref={statsRef}
              className="fade-in-up delay-400 flex gap-8"
            >
              <div>
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Projects Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">50+</div>
                <div className="text-sm text-gray-600">Happy Clients</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">98%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Content - Visual Elements */}
          <div className="relative">
            {/* Main Image Container */}
            <div className="relative">
              {/* Primary Card */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"
                  alt="Engineering workspace"
                  className="w-full h-64 object-cover rounded-2xl"
                />
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Engineering Solutions</h3>
                  <p className="text-gray-600">Innovative technology solutions for modern businesses</p>
                </div>
              </div>

              {/* Secondary Card */}
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-6 transform -rotate-6 hover:rotate-0 transition-transform duration-500 z-10">
                <img 
                  src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=400&q=80"
                  alt="Team collaboration"
                  className="w-48 h-32 object-cover rounded-xl"
                />
                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-gray-900">Talent Solutions</h4>
                  <p className="text-sm text-gray-600">Expert recruitment services</p>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-primary to-purple-600 text-white p-4 rounded-2xl shadow-lg animate-bounce-gentle">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm">Support</div>
              </div>

              <div className="absolute top-1/2 -left-8 bg-white rounded-full p-4 shadow-lg animate-pulse">
                <Star className="w-6 h-6 text-yellow-500 fill-current" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform duration-300">
          <span className="text-gray-600 text-sm mb-3 font-medium">Scroll Down</span>
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center hover:border-primary transition-colors duration-300">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Hero;
