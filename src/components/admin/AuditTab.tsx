
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, Search, Calendar, User, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auditAPI } from '@/services/auditAPI';
import { AuditLog } from '@/services/types';
import { format } from 'date-fns';
import AdminHeader from './AdminHeader';

const AuditTab = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    resource: '',
    action: '',
    userId: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 50
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAuditLogs();
  }, [filters.page]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const result = await auditAPI.getAll(filters);
      setLogs(result.logs);
      setPagination({
        total: result.total,
        page: result.page,
        totalPages: result.totalPages
      });
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch audit logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSearch = () => {
    fetchAuditLogs();
  };

  const handleExport = async () => {
    try {
      const blob = await auditAPI.export(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Success",
        description: "Audit logs exported successfully",
      });
    } catch (error) {
      console.error('Error exporting audit logs:', error);
      toast({
        title: "Error",
        description: "Failed to export audit logs",
        variant: "destructive",
      });
    }
  };

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'create': return 'bg-green-100 text-green-800';
      case 'update': return 'bg-blue-100 text-blue-800';
      case 'delete': return 'bg-red-100 text-red-800';
      case 'view': return 'bg-gray-100 text-gray-800';
      case 'login': return 'bg-purple-100 text-purple-800';
      case 'logout': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading audit logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-secondary-800">Audit Logs</h2>
          <p className="text-accent">Monitor system activities and user actions</p>
        </div>
        <Button onClick={handleExport} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Select value={filters.resource} onValueChange={(value) => handleFilterChange('resource', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Resource" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Resources</SelectItem>
                <SelectItem value="users">Users</SelectItem>
                <SelectItem value="companies">Companies</SelectItem>
                <SelectItem value="jobs">Jobs</SelectItem>
                <SelectItem value="applications">Applications</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.action} onValueChange={(value) => handleFilterChange('action', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="view">View</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="logout">Logout</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              placeholder="Start Date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
            />

            <Input
              type="date"
              placeholder="End Date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
            />

            <Input
              placeholder="User Email"
              value={filters.userId}
              onChange={(e) => handleFilterChange('userId', e.target.value)}
            />

            <Button onClick={handleSearch} className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Activity Log ({pagination.total} total)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {logs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-accent">No audit logs found</p>
              </div>
            ) : (
              logs.map((log) => (
                <div key={log._id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={getActionBadgeColor(log.action)}>
                        {log.action.toUpperCase()}
                      </Badge>
                      <span className="font-medium">{log.resource}</span>
                      {log.resourceName && (
                        <span className="text-accent">- {log.resourceName}</span>
                      )}
                    </div>
                    <span className="text-sm text-accent">
                      {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-accent">
                    <User className="w-4 h-4" />
                    <span>{log.userName} ({log.userEmail})</span>
                  </div>

                  {log.details && (
                    <p className="text-sm text-accent">{log.details}</p>
                  )}

                  {log.changes && log.changes.length > 0 && (
                    <div className="bg-gray-50 rounded p-3 text-sm">
                      <p className="font-medium mb-2">Changes:</p>
                      {log.changes.map((change, index) => (
                        <div key={index} className="mb-1">
                          <span className="font-medium">{change.field}:</span>
                          <span className="text-red-600 ml-2">{change.oldValue || 'null'}</span>
                          <span className="mx-2">→</span>
                          <span className="text-green-600">{change.newValue || 'null'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-accent">
                Showing page {pagination.page} of {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditTab;
