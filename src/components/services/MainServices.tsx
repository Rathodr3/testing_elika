
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Settings, GraduationCap, Monitor } from 'lucide-react';

const MainServices = () => {
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
    <>
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
    </>
  );
};

export default MainServices;
