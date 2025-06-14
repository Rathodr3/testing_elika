
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Shield, Clock, User, Activity } from 'lucide-react';
import { auditAPI } from '@/services/auditAPI';
import { useToast } from '@/hooks/use-toast';
import { AuditLog } from '@/services/types';
import AdminHeader from './AdminHeader';
import { Skeleton } from '@/components/ui/skeleton';

const AuditTab = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [resourceFilter, setResourceFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching audit logs...');
      
      const filters = {
        search: searchTerm,
        action: actionFilter === 'all' ? '' : actionFilter,
        resource: resourceFilter === 'all' ? '' : resourceFilter,
        page,
        limit: 20
      };
      
      const data = await auditAPI.getAll(filters);
      console.log('✅ Audit logs loaded:', data);
      
      setAuditLogs(data.logs || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('❌ Error fetching audit logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch audit logs. Please check your connection and try again.",
        variant: "destructive",
      });
      setAuditLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [page, actionFilter, resourceFilter]);

  const handleSearch = () => {
    setPage(1);
    fetchAuditLogs();
  };

  const handleExport = async () => {
    try {
      const filters = {
        search: searchTerm,
        action: actionFilter === 'all' ? '' : actionFilter,
        resource: resourceFilter === 'all' ? '' : resourceFilter
      };
      
      const blob = await auditAPI.export(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Audit logs exported successfully",
      });
    } catch (error) {
      console.error('❌ Error exporting audit logs:', error);
      toast({
        title: "Error",
        description: "Failed to export audit logs",
        variant: "destructive",
      });
    }
  };

  const getActionColor = (action: string) => {
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

  const getResourceColor = (resource: string) => {
    switch (resource) {
      case 'users': return 'bg-blue-100 text-blue-800';
      case 'companies': return 'bg-green-100 text-green-800';
      case 'jobs': return 'bg-yellow-100 text-yellow-800';
      case 'applications': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <AdminHeader title="Audit Logs" description="Track system activities and changes" />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Audit Log" 
        description="Track all user activities and system changes"
        onRefresh={fetchAuditLogs}
        action={
          <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Log
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditLogs.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Activities</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {auditLogs.filter(log => {
                const today = new Date().toDateString();
                const logDate = new Date(log.createdAt || '').toDateString();
                return today === logDate;
              }).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(auditLogs.map(log => log.userId)).size}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Events</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {auditLogs.filter(log => ['login', 'logout', 'delete'].includes(log.action || '')).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="flex gap-2">
            <Input
              placeholder="Search by user, resource, or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch} variant="outline">
              Search
            </Button>
          </div>
        </div>
        
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="create">Create</SelectItem>
            <SelectItem value="update">Update</SelectItem>
            <SelectItem value="delete">Delete</SelectItem>
            <SelectItem value="view">View</SelectItem>
            <SelectItem value="login">Login</SelectItem>
            <SelectItem value="logout">Logout</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={resourceFilter} onValueChange={setResourceFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by resource" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Resources</SelectItem>
            <SelectItem value="users">Users</SelectItem>
            <SelectItem value="companies">Companies</SelectItem>
            <SelectItem value="jobs">Jobs</SelectItem>
            <SelectItem value="applications">Applications</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Audit Logs */}
      {auditLogs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">No Audit Logs Found</h3>
            <p className="text-sm text-muted-foreground mt-2">
              {searchTerm || actionFilter || resourceFilter 
                ? "Try adjusting your search filters." 
                : "No audit activities have been recorded yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {auditLogs.map((log) => (
            <Card key={log._id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <Activity className="w-4 h-4 text-gray-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getActionColor(log.action || '')}>
                          {log.action}
                        </Badge>
                        <Badge className={getResourceColor(log.resource || '')}>
                          {log.resource}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(log.createdAt || '').toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {log.userName} ({log.userEmail})
                        </p>
                        {log.resourceName && (
                          <p className="text-sm text-muted-foreground">
                            Resource: {log.resourceName}
                          </p>
                        )}
                        {log.details && (
                          <p className="text-sm text-muted-foreground">
                            {log.details}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default AuditTab;
