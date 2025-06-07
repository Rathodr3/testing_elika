
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Building2, Briefcase, Monitor } from 'lucide-react';

interface JobHeroProps {
  onSearch?: (filters: {
    query: string;
    location: string;
    company: string;
    experience: string;
    workMode: string;
  }) => void;
}

const JobHero = ({ onSearch }: JobHeroProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [company, setCompany] = useState('');
  const [experience, setExperience] = useState('');
  const [workMode, setWorkMode] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({
        query: searchQuery,
        location,
        company,
        experience,
        workMode
      });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setLocation('');
    setCompany('');
    setExperience('');
    setWorkMode('');
    if (onSearch) {
      onSearch({
        query: '',
        location: '',
        company: '',
        experience: '',
        workMode: ''
      });
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="fade-in-up text-4xl lg:text-6xl font-bold text-secondary-800 dark:text-white mb-6">
            Career <span className="gradient-text">Opportunities</span>
          </h1>
          <p className="fade-in-up delay-200 text-xl text-accent dark:text-gray-300 leading-relaxed mb-8">
            Join our team of exceptional engineers and build the future of technology with us. 
            Discover exciting opportunities that match your skills and aspirations.
          </p>
          
          {/* Enhanced Job Search Form */}
          <div className="fade-in-up delay-400 max-w-4xl mx-auto mb-8">
            <form onSubmit={handleSearch} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
              {/* Main Search Bar */}
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search for job titles, skills, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 border-gray-200 dark:border-gray-600 focus:border-primary"
                  />
                </div>
                <Button 
                  type="submit"
                  className="h-12 bg-gradient-to-r from-primary via-purple-600 to-blue-600 hover:from-primary-600 hover:via-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>

              {/* Filter Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Location Filter */}
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="pl-10 h-11 border-gray-200 dark:border-gray-600">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-locations">All Locations</SelectItem>
                      <SelectItem value="Bangalore">Bangalore</SelectItem>
                      <SelectItem value="Chennai">Chennai</SelectItem>
                      <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                      <SelectItem value="Mumbai">Mumbai</SelectItem>
                      <SelectItem value="Pune">Pune</SelectItem>
                      <SelectItem value="Delhi">Delhi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Company Filter */}
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                  <Select value={company} onValueChange={setCompany}>
                    <SelectTrigger className="pl-10 h-11 border-gray-200 dark:border-gray-600">
                      <SelectValue placeholder="Company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-companies">All Companies</SelectItem>
                      <SelectItem value="Elika Engineering Pvt Ltd">Elika Engineering Pvt Ltd</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Experience Filter */}
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                  <Select value={experience} onValueChange={setExperience}>
                    <SelectTrigger className="pl-10 h-11 border-gray-200 dark:border-gray-600">
                      <SelectValue placeholder="Experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-experience">All Experience</SelectItem>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="mid">Mid Level (3+ years)</SelectItem>
                      <SelectItem value="senior">Senior (5+ years)</SelectItem>
                      <SelectItem value="lead">Lead (7+ years)</SelectItem>
                      <SelectItem value="executive">Executive (10+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Work Mode Filter */}
                <div className="relative">
                  <Monitor className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                  <Select value={workMode} onValueChange={setWorkMode}>
                    <SelectTrigger className="pl-10 h-11 border-gray-200 dark:border-gray-600">
                      <SelectValue placeholder="Work Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-work-modes">All Work Modes</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="on-site">On-site</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Clear Filters */}
              {(location || company || experience || workMode || searchQuery) && (
                <div className="flex justify-center">
                  <Button 
                    type="button"
                    variant="ghost"
                    onClick={handleClearFilters}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobHero;
