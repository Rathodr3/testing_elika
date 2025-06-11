
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Download, X } from 'lucide-react';

interface BulkOperationsBarProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onBulkExport: () => void;
  onBulkStatusChange: (status: string) => void;
  statusOptions: { value: string; label: string; }[];
  onClearSelection: () => void;
}

const BulkOperationsBar = ({
  selectedCount,
  onBulkDelete,
  onBulkExport,
  onBulkStatusChange,
  statusOptions,
  onClearSelection
}: BulkOperationsBarProps) => {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-blue-800">
          {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="text-blue-600 hover:text-blue-800"
        >
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <Select onValueChange={onBulkStatusChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Change status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkExport}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export
        </Button>
        
        <Button
          variant="destructive"
          size="sm"
          onClick={onBulkDelete}
          className="flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default BulkOperationsBar;
