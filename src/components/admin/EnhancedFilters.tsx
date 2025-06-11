
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';

interface FilterOption {
  key: string;
  label: string;
  value: string;
  options: { value: string; label: string; }[];
  onChange: (value: string) => void;
}

interface EnhancedFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  filters?: FilterOption[];
  onClearFilters?: () => void;
}

const EnhancedFilters = ({
  searchTerm,
  onSearchChange,
  placeholder = "Search...",
  filters = [],
  onClearFilters
}: EnhancedFiltersProps) => {
  const hasActiveFilters = searchTerm || filters?.some(filter => filter.value !== 'all' && filter.value !== '');

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      {/* Search Input */}
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Selects */}
      {filters && filters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Select
              key={filter.key}
              value={filter.value}
              onValueChange={filter.onChange}
            >
              <SelectTrigger className="w-40">
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
        </div>
      )}

      {/* Clear Filters Button */}
      {hasActiveFilters && onClearFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <X className="w-4 h-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default EnhancedFilters;
