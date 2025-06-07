
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, X, MapPin, Building, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SearchResult {
  id: string;
  title: string;
  type: 'job' | 'service' | 'page';
  location?: string;
  company?: string;
  description: string;
  url: string;
}

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Sample search data - in a real app this would come from an API
  const searchData: SearchResult[] = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      type: 'job',
      location: 'Bangalore, India',
      company: 'Elika Engineering',
      description: 'Full-time position for experienced software developer',
      url: '/projects'
    },
    {
      id: '2',
      title: 'DevOps Engineer',
      type: 'job',
      location: 'Hyderabad, India',
      company: 'Elika Engineering',
      description: 'Remote DevOps position with cloud expertise',
      url: '/projects'
    },
    {
      id: '3',
      title: 'Software Development',
      type: 'service',
      description: 'Custom software solutions and development services',
      url: '/services'
    },
    {
      id: '4',
      title: 'About Us',
      type: 'page',
      description: 'Learn more about Elika Engineering and our mission',
      url: '/about'
    },
    {
      id: '5',
      title: 'Contact Us',
      type: 'page',
      description: 'Get in touch with our team',
      url: '/contact'
    }
  ];

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setResults([]);
      return;
    }

    setIsLoading(true);
    // Simulate API delay
    const timer = setTimeout(() => {
      const filtered = searchData.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    onOpenChange(false);
    setSearchQuery('');
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'job':
        return <Building className="h-4 w-4 text-blue-500" />;
      case 'service':
        return <Search className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search jobs, services, or pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
              autoFocus
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="py-8 text-center text-gray-500">
                  Searching...
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-2">
                  {results.map((result) => (
                    <div
                      key={result.id}
                      className="p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="flex items-start gap-3">
                        {getResultIcon(result.type)}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{result.title}</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{result.description}</p>
                          {result.location && (
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{result.location}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full capitalize">
                          {result.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          )}

          {!searchQuery && (
            <div className="py-8 text-center text-gray-500">
              Start typing to search for jobs, services, or pages...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
