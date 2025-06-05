
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Settings, GraduationCap, Code, Database, Wrench, UserPlus, BookOpen, Award, ArrowRight, CheckCircle, Mail, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  const handleScrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const handleContactClick = () => {
    window.scrollTo(0, 0);
  };

  const mainServices = [
    {
      icon: Users,
      title: 'Human Resource Services',
      subtitle: 'Expert talent at every stage of digital transformation',
      description: 'In the realm of recruitment, Elika Engineering Pvt Ltd stands out as a go-to partner for both permanent and contract hiring solutions. Our network spans across various industries from manufacturing to infrastructure engineering, and the pharmaceutical sector, our expertise knowledge is unparalleled.',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=500&h=300&fit=crop',
      features: [
        'Permanent Staffing',
        'Contract Staffing', 
        'Recruitment Process Outsourcing (RPO)'
      ],
      details: {
        permanent: 'With deep Industry knowledge, Elika Engineering Pvt Ltd connects exceptional talent with organizations seeking adaptability and excellence. We also schedule workshops with clients for better growth.',
        contract: 'Specialising in IT and engineering, we provide flexible staffing solutions for project-based requirements. Our efficient approach and strategic partnerships help you stay focused on growth and innovation.',
        rpo: 'Elika Engineering Pvt Ltd partners with your HR team to deliver tailored RPO solutions, streamlining recruitment from sourcing to employment so you can focus on strategic goals.'
      }
    },
    {
      icon: Settings,
      title: 'Engineering Solutions',
      subtitle: 'From strategy to execution, we meet every need, ensure every result',
      description: 'Elika Engineering Pvt Ltd, a dynamic hub where innovation, engineering expertise, and premier recruitment services converge. As pioneers in the industry, we specialize in engineering software solutions consultancy, navigating the complexities of CAD, Software Engineering, etc with finesse. Our engineering design services consultancy further exemplify our commitment to cutting-edge solutions.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=300&fit=crop',
      features: [
        'Software Solutions Consultancy',
        'CAD Engineering',
        'System Integration'
      ]
    },
    {
      icon: GraduationCap,
      title: 'Training Services',
      subtitle: 'From Expertise to Empowerment, We Deliver the Skills that Drive Success',
      description: 'We provide specialized training programs to enhance the skills and knowledge of your team, ensuring they stay competitive in a fast-evolving industry. Our training services cover a wide range of topics, from technical skills and software proficiency to industry-specific training. By investing in your teams growth, you empower them to perform at their best, driving overall organizational success.',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&h=300&fit=crop',
      features: [
        'Technical Skills Training',
        'Software Proficiency',
        'Industry-Specific Programs'
      ]
    },
    {
      icon: Monitor,
      title: 'IT Services',
      subtitle: 'Comprehensive technology solutions for modern business needs',
      description: 'Elika Engineering Pvt Ltd delivers comprehensive IT services designed to streamline your technology infrastructure and drive digital transformation. From software development and system integration to cloud solutions and cybersecurity, we provide end-to-end technology services that help businesses operate efficiently and securely in todays digital landscape.',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=500&h=300&fit=crop',
      features: [
        'Software Development',
        'Cloud Solutions',
        'Cybersecurity Services'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-6">
        {/* Hero Section */}
        <section className="py-12 lg:py-16 relative overflow-hidden min-h-screen flex items-center justify-center">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: 'url(/lovable-uploads/2a81bc1b-64f5-46f8-92a7-3ba18e9c50a0.png)',
              }}
            ></div>
            <div className="absolute inset-0 bg-white/85"></div>
          </div>

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
            <div className="max-w-7xl mx-auto">
              <div className="text-center">
                <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                  Our Services
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                  <span className="text-primary">Services</span> We Offer
                </h1>
                <div className="space-y-6 text-lg text-gray-700 mb-8 max-w-4xl mx-auto">
                  <p className="text-2xl text-primary font-semibold">
                    Industry leading Specialists in Business Consulting, Human Resource Services, & Engineering Solutions
                  </p>
                  <p>
                    Welcome to our world of innovation and expertise. Dive into a realm where business consulting, human 
                    resource services, and engineering solutions converge to redefine possibilities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

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
                Explore our suite of services meticulously crafted to empower your ventures, optimize operations, and engineer success.
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

        {/* Contact CTA Section */}
        <section className="py-12 lg:py-16 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
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
                    Let's Talk About Your
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"> Needs</span>
                  </h2>
                  
                  <p className="text-xl text-white/80 mb-8 leading-relaxed">
                    See how our innovative engineering services can bring value to your project and help you achieve your goals with excellence and efficiency.
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
                    <Link to="/contact" onClick={handleContactClick}>
                      <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 h-auto text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                        Contact Us Today
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
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
                      <p className="text-white/70 text-lg">Ready to discuss your service needs?</p>
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

export default Services;
