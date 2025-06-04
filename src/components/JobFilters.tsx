
import React from 'react';

interface JobFiltersProps {
  jobType: string;
  setJobType: (type: string) => void;
  experience: string;
  setExperience: (exp: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  resultsCount: number;
}

const JobFilters = ({
  jobType,
  setJobType,
  experience,
  setExperience,
  searchTerm,
  setSearchTerm,
  resultsCount
}: JobFiltersProps) => {
  const jobTypes = ['All', 'Full-time', 'Contract', 'Remote'];
  const experienceLevels = ['All', 'Entry Level', '2+ years', '3+ years', '4+ years', '5+ years', '6+ years'];

  return (
    <section className="py-6 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="fade-in-up grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Type
              </label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
              >
                {jobTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Experience
              </label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                {experienceLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {resultsCount} job{resultsCount !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobFilters;
