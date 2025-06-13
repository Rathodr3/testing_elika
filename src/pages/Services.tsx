import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Settings, GraduationCap, Code, Database, Wrench, UserPlus, BookOpen, Award, ArrowRight, CheckCircle, Mail, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';
import Features from '@/components/Features';

const Services = () => {
  const handleScrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const handleContactClick = () => {
    window.scrollTo(0, 0);
  };

  const mainServices = [
    {
      icon: Settings,
      title: 'Engineering Solutions',
      subtitle: 'From Strategy to Execution, We Meet Every Need, Ensure Every Result',
      description: 'Elika Engineering Pvt Ltd, a dynamic hub where innovation, engineering expertise, and premier recruitment services converge. As pioneers in the industry, we specialize in engineering software solutions consultancy, navigating the complexities of CAD, Software Engineering, etc with finesse. Our engineering design services consultancy further exemplify our commitment to cutting-edge solutions.',
      image: '/lovable-uploads/EngineeringSolutions.jpg?w=500&h=300&fit=crop',
      features: [
        'Engineering Software Solutions',
        'Enterprize Software Solutions (Zoho)',
        'Engineering Services'
      ]
    },
    {
      icon: Monitor,
      title: 'IT Services',
      subtitle: 'Comprehensive Technology Solutions For Modern Business Needs',
      description: 'Elika Engineering Pvt Ltd delivers comprehensive IT services designed to streamline your technology infrastructure and drive digital transformation. From software development and system integration to cloud solutions and customize software solutions, we provide end-to-end technology services that help businesses operate efficiently and securely in todays digital landscape.',
      image: '/lovable-uploads/IT.jpg?w=500&h=300&fit=crop',
      features: [
        'Software Development',
        'Cloud Solutions',
        'Customize Software Solution'
      ]
    },
    {
      icon: Users,
      title: 'Staff Augmentation',
      subtitle: 'Expert Talent at Every Stage of Digital Transformation',
      description: 'In the realm of recruitment, Elika Engineering Pvt Ltd stands out as a go-to partner for both permanent and contract hiring solutions. Our network spans across various industries from IT, Automobile  manufacturing to infrastructure engineering, and the Health Care sector, our expertise knowledge is unparalleled.',
      image: '/lovable-uploads/HumanResourceServices.jpg?w=500&h=300&fit=crop',
      features: [],
      details: {
        permanent: 'With deep Industry knowledge, Elika Engineering Pvt Ltd connects exceptional talent with organizations seeking adaptability and excellence. We also schedule workshops with clients for better growth.',
        contract: 'Specialising in IT and engineering, we provide flexible staffing solutions for project-based requirements. Our efficient approach and strategic partnerships help you stay focused on growth and innovation.',
        rpo: 'Elika Engineering Pvt Ltd partners with your HR team to deliver tailored RPO solutions, streamlining recruitment from sourcing to employment so you can focus on strategic goals.'
      }
    },
    {
      icon: GraduationCap,
      title: 'Training and Development',
      subtitle: 'From Expertise to Empowerment, We Deliver The Skills That Drive Success',
      description: 'We provide specialized training programs to enhance the skills and knowledge of your team, ensuring they stay competitive in a fast-evolving industry. Our training services cover a wide range of topics, from technical skills and software proficiency to industry-specific training. By investing in your teams growth, you empower them to perform at their best, driving overall organizational success.',
      image: '/lovable-uploads/Training.jpg?w=500&h=300&fit=crop',
      features: [
        'Technical Skills Training',
        'Software Proficiency',
        'Industry-Specific Programs'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-6">
        {/* Hero Section - Enhanced Design */}
        <section className="relative bg-gradient-to-br from-blue-600 via-primary to-purple-700 min-h-screen flex items-center overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/10 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>

          {/* Geometric Shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-16 h-16 border-2 border-white/30 rounded-lg rotate-45 animate-float"></div>
            <div className="absolute bottom-32 right-20 w-24 h-24 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-white/20 rounded-full"></div>
            <div className="absolute bottom-1/4 left-1/4 w-12 h-12 border border-white/25 rounded-full"></div>
          </div>

          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                
                {/* Left Content */}
                <div className="text-left">
                  {/* Badge */}
                  <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-full text-sm font-semibold mb-8 shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse"></div>
                    Our Services
                  </div>

                  {/* Main Title */}
                  <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                    <span className="block">Services</span>
                    <span className="block text-blue-100">We Offer</span>
                  </h1>

                  {/* Subtitle */}
                  <p className="text-xl lg:text-2xl text-blue-100 font-semibold mb-6 leading-relaxed">
                    Industry leading Specialists in Engineering Solutions, IT service, Training, & Staff Augmentation.
                  </p>

                  {/* Description */}
                  <p className="text-lg text-white/90 mb-8 leading-relaxed max-w-lg">
                    Welcome to our world of innovation and expertise. Dive into a realm where engineering solutions, IT services, and staff augmentation services converge to redefine possibilities.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      size="lg" 
                      className="bg-white text-primary hover:bg-blue-50 font-semibold px-8 py-4 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
                      onClick={() => document.getElementById('services-content')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      Explore Services
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-4 rounded-full backdrop-blur-sm bg-white/10 transform hover:scale-105 transition-all duration-300"
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
                  <div className="relative overflow-hidden rounded-3xl shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-500 bg-white/95 backdrop-blur-lg border border-white/20">
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
                  <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm border border-white/30 flex items-center justify-center">
                    <Settings className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-r from-purple-400/80 to-pink-400/80 rounded-full backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform duration-300" onClick={() => document.getElementById('services-content')?.scrollIntoView({ behavior: 'smooth' })}>
              <span className="text-white/80 text-sm mb-3 font-medium">Explore More</span>
              <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center hover:border-white transition-colors duration-300">
                <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Content Section */}
        <div id="services-content">
          {/* Services Tagline */}
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
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Welcome to our world of innovation and expertise. Dive into a realm where engineering solutions, IT services, and staff augmentation services converge to redefine possibilities.
                </p>
              </div>
            </div>
          </section>

          {/* Main Services */}
          {mainServices.map((service, index) => (
            <section key={index} className={`py-8 lg:py-12 ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}>
              <div className="container mx-auto px-4 lg:px-8">
                <div className="max-w-7xl mx-auto">
                  {/* Service Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary/20 via-primary/15 to-purple-600/15 text-primary rounded-full text-lg font-bold mb-6 border-2 border-primary/30 shadow-lg">
                      <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent text-xl font-extrabold">
                        {service.subtitle}
                      </span>
                    </div>
                  </div>

                  <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                    <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                      <div className="flex items-center mb-6">
                        <service.icon className="w-12 h-12 text-primary mr-4" />
                        <h3 className="text-3xl lg:text-4xl font-bold text-gray-900">{service.title}</h3>
                      </div>
                      
                      <p className="text-lg text-gray-600 leading-relaxed mb-8 text-justify">
                        {service.description}
                      </p>

                      <div className="space-y-4">
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center">
                            <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                            <span className="font-semibold text-gray-900">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {service.details && (
                        <div className="mt-8 space-y-4">
                          <Card className="border-0 shadow-lg bg-white">
                            <CardContent className="p-6">
                              <h4 className="font-bold text-gray-900 mb-2">Permanent Staffing</h4>
                              <p className="text-gray-600 text-sm text-justify">{service.details.permanent}</p>
                            </CardContent>
                          </Card>
                          <Card className="border-0 shadow-lg bg-white">
                            <CardContent className="p-6">
                              <h4 className="font-bold text-gray-900 mb-2">Contractual Staffing</h4>
                              <p className="text-gray-600 text-sm text-justify">{service.details.contract}</p>
                            </CardContent>
                          </Card>
                          <Card className="border-0 shadow-lg bg-white">
                            <CardContent className="p-6">
                              <h4 className="font-bold text-gray-900 mb-2">Recruitment Process Outsourcing (RPO)</h4>
                              <p className="text-gray-600 text-sm text-justify">{service.details.rpo}</p>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                    
                    <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                      <img 
                        src={service.image} 
                        alt={service.title}
                        className="rounded-3xl shadow-xl w-full h-[400px] object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ))}

          {/* Service Features Grid */}
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
                  {[
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
                  ].map((feature, index) => (
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
        </div>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Services;
