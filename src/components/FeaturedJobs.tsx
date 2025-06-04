import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import JobApplicationModal from './JobApplicationModal';

const FeaturedJobs = () => {
  const [selectedJob, setSelectedJob] = useState<{
    id: string;
    title: string;
    company: string;
  } | null>(null);

  const jobs = [
    {
      id: "1",
      title: "Senior Software Engineer",
      company: "TechCorp Solutions",
      location: "Bangalore, India",
      type: "Full-time",
      salary: "₹15-25 LPA",
      description: "Join our dynamic team to build scalable software solutions using React, Node.js, and cloud technologies.",
      posted: "2 days ago"
    },
    {
      id: "2",
      title: "Mechanical Design Engineer",
      company: "AutoTech Industries",
      location: "Chennai, India",
      type: "Full-time",
      salary: "₹8-15 LPA",
      description: "Design and develop automotive components using CAD software and work on innovative manufacturing processes.",
      posted: "1 week ago"
    },
    {
      id: "3",
      title: "DevOps Engineer",
      company: "CloudFirst Technologies",
      location: "Hyderabad, India",
      type: "Full-time",
      salary: "₹12-20 LPA",
      description: "Implement CI/CD pipelines, manage cloud infrastructure, and ensure scalable deployment processes.",
      posted: "3 days ago"
    }
  ];

  const handleApplyClick = (job: { id: string; title: string; company: string }) => {
    setSelectedJob(job);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  const handleViewAllClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-secondary-800 mb-6">
              Featured Opportunities
            </h2>
            <p className="text-xl text-accent max-w-3xl mx-auto leading-relaxed">
              Discover exciting career opportunities with our partner companies across various industries.
            </p>
          </div>

          {/* Jobs Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {jobs.map((job, index) => (
              <Card 
                key={index} 
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white card-hover group"
              >
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-secondary-800 mb-2 group-hover:text-primary transition-colors duration-300">
                      {job.title}
                    </h3>
                    <p className="text-primary font-semibold">{job.company}</p>
                  </div>
                  
                  <div className="space-y-2 mb-4 text-sm text-accent">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {job.type} • {job.posted}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" />
                      {job.salary}
                    </div>
                  </div>
                  
                  <p className="text-accent leading-relaxed mb-6">
                    {job.description}
                  </p>
                  
                  <Button 
                    className="w-full group"
                    onClick={() => handleApplyClick({
                      id: job.id,
                      title: job.title,
                      company: job.company
                    })}
                  >
                    Apply Now
                    <Clock className="ml-2 w-4 h-4 group-hover:rotate-12 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* View All Jobs Button */}
          <div className="text-center">
            <Link to="/projects" onClick={handleViewAllClick}>
              <Button variant="outline" size="lg" className="px-8 py-4 border-primary text-primary hover:bg-primary/10">
                View All Opportunities
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Job Application Modal */}
      {selectedJob && (
        <JobApplicationModal
          isOpen={!!selectedJob}
          onClose={handleCloseModal}
          jobTitle={selectedJob.title}
          jobId={selectedJob.id}
          company={selectedJob.company}
        />
      )}
    </section>
  );
};

export default FeaturedJobs;
