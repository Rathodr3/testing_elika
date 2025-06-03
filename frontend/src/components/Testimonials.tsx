
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      position: "HR Director",
      company: "Tech Innovations Inc.",
      content: "Elika Engineering transformed our hiring process. Their attention to detail and understanding of our technical requirements is unmatched. The quality of candidates they provide consistently exceeds our expectations.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b631?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Michael Chen",
      position: "CTO",
      company: "AutoTech Solutions",
      content: "The engineering solutions provided exceeded our expectations. Professional, timely, and innovative approach to complex challenges. Their team seamlessly integrates with our workflow and delivers outstanding results.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Emily Rodriguez",
      position: "Operations Manager",
      company: "AeroSpace Dynamics",
      content: "Outstanding recruitment services. They found us the perfect candidates who fit both technically and culturally with our team. Their understanding of our industry needs is remarkable.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face"
    }
  ];

  return (
    <section className="py-24 lg:py-32 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              Client Success Stories
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-600 to-blue-600">Clients</span> Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Don't just take our word for it. Here's what industry leaders have to say about our engineering and recruitment excellence.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/90 backdrop-blur-sm group relative overflow-hidden rounded-2xl"
              >
                {/* Card Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <CardContent className="p-8 relative z-10">
                  {/* Quote Icon */}
                  <div className="flex justify-between items-start mb-6">
                    <Quote className="w-10 h-10 text-primary/30" />
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  
                  {/* Testimonial Content */}
                  <p className="text-gray-700 leading-relaxed mb-8 italic text-lg">
                    "{testimonial.content}"
                  </p>
                  
                  {/* Client Info */}
                  <div className="flex items-center">
                    <div className="relative">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600 font-medium">{testimonial.position}</p>
                      <p className="text-sm text-primary font-semibold">{testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation & Stats */}
          <div className="flex flex-col lg:flex-row items-center justify-between">
            {/* Navigation */}
            <div className="flex items-center space-x-4 mb-8 lg:mb-0">
              <Button
                variant="outline"
                size="lg"
                className="h-14 w-14 rounded-full border-2 border-gray-200 hover:border-primary hover:bg-primary hover:text-white transition-all duration-300"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 w-14 rounded-full border-2 border-gray-200 hover:border-primary hover:bg-primary hover:text-white transition-all duration-300"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">98%</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">500+</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">50+</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">Industry Awards</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
