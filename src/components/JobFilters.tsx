
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Briefcase, Filter, X } from 'lucide-react';

interface JobFiltersProps {
  jobType: string;
  setJobType: (type: string) => void;
  experience: string;
  setExperience: (exp: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  resultsCount: number;
  location?: string;
  setLocation?: (location: string) => void;
  onClearFilters?: () => void;
}

const JobFilters = ({
  jobType,
  setJobType,
  experience,
  setExperience,
  searchTerm,
  setSearchTerm,
  resultsCount,
  location = '',
  setLocation,
  onClearFilters
}: JobFiltersProps) => {
  const jobTypes = ['All', 'Full-time', 'Contract', 'Remote', 'Part-time', 'Internship'];
  const experienceLevels = ['All', 'Entry Level', '1+ years', '2+ years', '3+ years', '4+ years', '5+ years', '6+ years'];
  const locations = ['All', 'Bangalore', 'Chennai', 'Hyderabad', 'Mumbai', 'Pune', 'Delhi'];

  const hasActiveFilters = jobType !== 'All' || experience !== 'All' || searchTerm !== '' || location !== '';

  const handleClearFilters = () => {
    setJobType('All');
    setExperience('All');
    setSearchTerm('');
    if (setLocation) setLocation('');
    if (onClearFilters) onClearFilters();
  };

  return (
    <section className="py-6 bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-20 z-40">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Filter Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Filter Jobs</h3>
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-primary hover:text-primary-600"
              >
                <X className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Filters Grid */}
          <div className="fade-in-up grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search jobs..."
                className="pl-10 h-11 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Location Filter */}
            {setLocation && (
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select 
                  className="w-full h-11 pl-10 pr-4 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Job Type Filter */}
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select 
                className="w-full h-11 pl-10 pr-4 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
              >
                {jobTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Experience Filter */}
            <div>
              <select 
                className="w-full h-11 px-4 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                {experienceLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Results Count and Active Filters */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-white">{resultsCount}</span> job{resultsCount !== 1 ? 's' : ''} found
            </div>
            
            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500">Active filters:</span>
                {jobType !== 'All' && (
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">{jobType}</span>
                )}
                {experience !== 'All' && (
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">{experience}</span>
                )}
                {location !== '' && location !== 'All' && (
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">{location}</span>
                )}
                {searchTerm !== '' && (
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full">"{searchTerm}"</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobFilters;
