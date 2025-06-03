
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Settings, GraduationCap, Code, Database, Wrench, UserPlus, BookOpen, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  const handleScrollToTop = () => {
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
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-br from-secondary-800 via-secondary-700 to-secondary-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          <div className="container mx-auto px-4 lg:px-8 relative">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                Our <span className="text-yellow-400">Services</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed mb-8 max-w-3xl mx-auto">
                Industry leading Specialists in Business Consulting, Human Resource Services, & Engineering Solutions
              </p>
            </div>
          </div>
        </section>

        {/* Services Introduction */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl lg:text-5xl font-bold text-secondary-800 mb-8">
                Explore our services
              </h2>
              <p className="text-lg text-accent leading-relaxed">
                Welcome to our world of innovation and expertise. Dive into a realm where business consulting, human 
                resource services, and engineering solutions converge to redefine possibilities. Explore our suite of services 
                meticulously crafted to empower your ventures, optimize operations, and engineer success. Let's embark on a 
                journey of discovery together.
              </p>
            </div>
          </div>
        </section>

        {/* Main Services */}
        {mainServices.map((service, index) => (
          <section key={index} className={`py-20 lg:py-32 ${index % 2 === 1 ? 'bg-muted/30' : ''}`}>
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-6xl mx-auto">
                {/* Service Header */}
                <div className="text-center mb-16">
                  <div className="bg-primary text-white py-3 px-6 rounded-lg inline-block mb-6">
                    <p className="font-bold">{service.subtitle}</p>
                  </div>
                </div>

                <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                  <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                    <div className="flex items-center mb-6">
                      <service.icon className="w-12 h-12 text-primary mr-4" />
                      <h3 className="text-3xl lg:text-4xl font-bold text-secondary-800">{service.title}</h3>
                    </div>
                    
                    <p className="text-lg text-accent leading-relaxed mb-8">
                      {service.description}
                    </p>

                    <div className="space-y-4">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                          <span className="font-semibold text-secondary-800">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {service.details && (
                      <div className="mt-8 space-y-4">
                        <div className="bg-white rounded-lg p-6 shadow-lg">
                          <h4 className="font-bold text-secondary-800 mb-2">Permanent Staffing</h4>
                          <p className="text-accent text-sm">{service.details.permanent}</p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-lg">
                          <h4 className="font-bold text-secondary-800 mb-2">Contractual Staffing</h4>
                          <p className="text-accent text-sm">{service.details.contract}</p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-lg">
                          <h4 className="font-bold text-secondary-800 mb-2">Recruitment Process Outsourcing (RPO)</h4>
                          <p className="text-accent text-sm">{service.details.rpo}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Service Features Grid */}
        <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-5xl font-bold text-secondary-800 mb-6">
                  Why Choose Our Services?
                </h2>
                <p className="text-xl text-accent max-w-4xl mx-auto leading-relaxed">
                  We deliver comprehensive solutions that drive growth, optimize operations, and ensure lasting success.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
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
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white card-hover">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                        <feature.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-secondary-800 mb-4">{feature.title}</h3>
                      <p className="text-accent leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

          {/* Contact Section */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-secondary-800 mb-4">
                Let's Talk About Your Needs
              </h3>
              <p className="text-lg text-accent mb-6">
                See how our innovative engineering services can bring value to your project.
              </p>
              <Link to="/contact" onClick={handleContactClick}>
                <Button size="lg" className="hover:scale-105 transition-transform duration-300">
                  Contact Us Today
                </Button>
              </Link>
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
