import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Target, Award, Heart, Lightbulb, Eye, Handshake, Shield, UserCheck, Globe, ArrowRight, Play, CheckCircle, Star, TrendingUp, Mail } from 'lucide-react';

const AboutUs = () => {
  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Driving forward-thinking solutions and creative approaches to engineering challenges.'
    },
    {
      icon: Target,
      title: 'Goals',
      description: 'Setting clear objectives and achieving measurable results for our clients and partners.'
    },
    {
      icon: Users,
      title: 'Teamwork',
      description: 'Fostering collaboration and unity to deliver exceptional engineering solutions.'
    },
    {
      icon: Handshake,
      title: 'Commitment',
      description: 'Dedicated to excellence and unwavering in our promise to deliver quality results.'
    },
    {
      icon: Shield,
      title: 'Integrity',
      description: 'Maintaining the highest ethical standards in all our business practices and relationships.'
    },
    {
      icon: UserCheck,
      title: 'Customers',
      description: 'Putting our clients first and ensuring their success is at the heart of everything we do.'
    },
    {
      icon: Globe,
      title: 'Responsibility',
      description: 'Taking accountability for our actions and their impact on society and the environment.'
    }
  ];

  const achievements = [
    { number: "8+", label: "Years Experience", icon: TrendingUp },
    { number: "500+", label: "Projects Completed", icon: CheckCircle },
    { number: "50+", label: "Happy Clients", icon: Heart },
    { number: "98%", label: "Success Rate", icon: Star }
  ];

  const teamMembers = [
    {
      name: "Rajesh Kumar",
      position: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      description: "Visionary leader with 15+ years in engineering",
      expertise: "Strategic Leadership"
    },
    {
      name: "Priya Sharma",
      position: "CTO",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b631?w=300&h=300&fit=crop&crop=face",
      description: "Technology expert driving innovation",
      expertise: "Technical Innovation"
    },
    {
      name: "Amit Patel",
      position: "Head of Engineering",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      description: "Engineering excellence and quality assurance",
      expertise: "Quality Assurance"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                {/* Left Content */}
                <div>
                  <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                    About Our Company
                  </div>
                  <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                    About <span className="text-primary">Elika Engineering</span>
                  </h1>
                  <div className="space-y-6 text-lg text-gray-700 mb-8">
                    <p className="text-2xl text-primary font-semibold">
                      Enthusiastic, Collaborative, and Transparent
                    </p>
                    <p>
                      That's how we bring talent and clients together in the demanding world of engineering excellence.
                    </p>
                    <p>
                      With 8 years of experience in Engineering Industries, we successfully deliver excellent support to our customers. Elika Engineering Pvt. Ltd. is a young and dynamic team delivering Human Resource, IT/Non-IT Engineering services, and Training solutions.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 mb-12">
                    <Button size="lg" className="bg-primary hover:bg-primary-600 text-white px-8 py-4 h-auto text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                      <Play className="mr-2 w-5 h-5" />
                      Watch Our Story
                    </Button>
                    <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 h-auto text-lg font-semibold rounded-xl hover:scale-105 transition-all duration-300">
                      Get Started
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>

                  {/* Achievement Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <achievement.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                        <div className="text-3xl font-bold text-gray-900 mb-1">{achievement.number}</div>
                        <div className="text-sm text-gray-600 font-medium">{achievement.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Image Grid */}
                <div className="relative">
                  <div className="grid grid-cols-2 gap-6 h-[600px]">
                    <div className="flex flex-col gap-6">
                      <div className="bg-primary/10 rounded-3xl p-8 h-48 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl font-bold text-primary mb-2">8+</div>
                          <div className="text-gray-700 font-semibold">Years of Excellence</div>
                        </div>
                      </div>
                      <img 
                        src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop" 
                        alt="Team collaboration" 
                        className="rounded-3xl shadow-xl w-full h-64 object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-6 mt-12">
                      <img 
                        src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop" 
                        alt="Engineering workspace" 
                        className="rounded-3xl shadow-xl w-full h-64 object-cover"
                      />
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 h-48 flex items-center justify-center text-white">
                        <div className="text-center">
                          <div className="text-6xl font-bold mb-2">500+</div>
                          <div className="font-semibold">Projects Delivered</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute top-20 -left-4 w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute bottom-20 -right-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Banner */}
        <section className="py-16 lg:py-24 bg-gradient-to-r from-primary via-purple-600 to-blue-600">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8">
                Make your impact with Higher "AIM"
              </h2>
            </div>
          </div>
        </section>

        {/* Vision & Mission Section */}
        <section className="py-20 lg:py-32 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                  Our Purpose
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Driving the future of engineering excellence through innovation and dedication
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-16">
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12 h-full">
                    <div className="text-center mb-8">
                      <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Eye className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-4xl font-bold text-gray-900 mb-6">VISION</h3>
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed text-center">
                      "To be the premier engineering services company, driving brand growth and success through innovative solutions, strategic placement, and unmatched expertise."
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-12 h-full">
                    <div className="text-center mb-8">
                      <div className="w-24 h-24 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Target className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-4xl font-bold text-gray-900 mb-6">MISSION</h3>
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed text-center">
                      "Our mission is to provide engineering services, seamless placement solutions, and dynamic work culture, enabling our clients to achieve their brand-building objectives with excellence, efficiency, and lasting impact."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-20 lg:py-32 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                  Our Foundation
                </div>
                <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-8">
                  CORE VALUES
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  The fundamental principles that guide our organization and define our character
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {values.map((value, index) => (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white group text-center rounded-3xl overflow-hidden">
                    <CardContent className="p-8">
                      <div className="w-20 h-20 bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                        <value.icon className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase">{value.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 lg:py-32 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                  Meet Our Team
                </div>
                <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-8">
                  Leadership Team
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Experienced professionals driving innovation and excellence in engineering
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-12">
                {teamMembers.map((member, index) => (
                  <div key={index} className="group text-center">
                    <div className="relative mb-8">
                      <div className="w-64 h-64 mx-auto rounded-3xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300">
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-6 py-2 shadow-lg border border-gray-100">
                        <span className="text-sm font-semibold text-primary">{member.expertise}</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-primary font-semibold mb-3">{member.position}</p>
                    <p className="text-gray-600 leading-relaxed">{member.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.3),transparent_60%)]"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(147,51,234,0.3),transparent_60%)]"></div>
            
            {/* Geometric Shapes */}
            <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white/10 rounded-full animate-pulse"></div>
            <div className="absolute bottom-32 right-20 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl rotate-45"></div>
            <div className="absolute top-1/2 left-10 w-16 h-16 bg-white/5 rounded-full"></div>
            <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-blue-400/30 rounded-full"></div>
            <div className="absolute bottom-1/4 left-1/3 w-12 h-12 bg-purple-400/20 rounded-full blur-sm"></div>
          </div>

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                {/* Left Content */}
                <div>
                  <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white/90 mb-6">
                    Get In Touch
                  </div>
                  
                  <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    Ready to Start Your
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"> Engineering Journey?</span>
                  </h2>
                  
                  <p className="text-xl text-white/80 mb-8 leading-relaxed">
                    Let's discuss how our innovative engineering services can bring value to your project and help you achieve your goals with excellence and efficiency.
                  </p>

                  {/* Key Benefits */}
                  <div className="space-y-4 mb-8">
                    {[
                      "Expert Engineering Consultation",
                      "Tailored Solutions for Your Needs", 
                      "8+ Years of Industry Experience",
                      "500+ Successful Projects Delivered"
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white/90 text-lg">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Contact Actions */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 h-auto text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                      Get Started Today
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 h-auto text-lg font-semibold rounded-xl hover:scale-105 transition-all duration-300">
                      <Play className="mr-2 w-5 h-5" />
                      Schedule a Call
                    </Button>
                  </div>
                </div>

                {/* Right Side - Contact Card */}
                <div className="relative">
                  <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 lg:p-10 border border-white/20 shadow-2xl">
                    <div className="text-center mb-8">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">Let's Connect</h3>
                      <p className="text-white/70 text-lg">Ready to discuss your engineering needs?</p>
                    </div>

                    {/* Contact Options */}
                    <div className="space-y-6">
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                            <Mail className="w-6 h-6 text-blue-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold text-lg mb-1">Email Us</h4>
                            <p className="text-white/70">contact@elikaengineering.com</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                            <Play className="w-6 h-6 text-purple-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold text-lg mb-1">Book a Call</h4>
                            <p className="text-white/70">Schedule a consultation</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold text-lg mb-1">Quick Response</h4>
                            <p className="text-white/70">Get reply within 24 hours</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 text-center">
                      <p className="text-white/60 text-sm">
                        Trusted by 50+ companies worldwide
                      </p>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default AboutUs;
