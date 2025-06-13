
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface Filter {
  key: string;
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

interface EnhancedFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  filters: Filter[];
  onClearFilters: () => void;
}

const EnhancedFilters = ({
  searchTerm,
  onSearchChange,
  placeholder = "Search...",
  filters,
  onClearFilters
}: EnhancedFiltersProps) => {
  const hasActiveFilters = searchTerm || filters.some(filter => filter.value && filter.value !== 'all');

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        {filters.map((filter) => (
          <Select
            key={filter.key}
            value={filter.value}
            onValueChange={filter.onChange}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
        
        {hasActiveFilters && (
          <Button variant="outline" onClick={onClearFilters} className="flex items-center gap-2">
            <X className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default EnhancedFilters;
