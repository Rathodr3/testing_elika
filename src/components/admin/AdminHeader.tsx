
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  description: string;
  onRefresh?: () => void;
  action?: React.ReactNode;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  title, 
  description, 
  onRefresh,
  action 
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        {onRefresh && (
          <Button variant="outline" onClick={onRefresh} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        )}
        {action}
      </div>
    </div>
  );
};

export default AdminHeader;
