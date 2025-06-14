
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Edit, Trash2, Mail, Phone, Globe } from 'lucide-react';
import { Company as CompanyType, companiesAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useAdminData } from '@/contexts/AdminDataContext';
import CreateCompanyForm from './CreateCompanyForm';
import EditCompanyForm from './EditCompanyForm';
import AdminHeader from './AdminHeader';
import EnhancedFilters from './EnhancedFilters';
import PermissionWrapper from './PermissionWrapper';

const CompaniesTab = () => {
  const [companies, setCompanies] = useState<CompanyType[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyType | null>(null);
  const { toast } = useToast();
  const { refreshTrigger, setRefreshing } = useAdminData();

  useEffect(() => {
    fetchCompanies();
  }, [refreshTrigger]);

  useEffect(() => {
    filterCompanies();
  }, [companies, searchTerm]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      console.log('🔍 Fetching companies for admin dashboard...');
      const data = await companiesAPI.getAll();
      console.log('✅ Companies fetched:', data);
      
      const companiesArray = Array.isArray(data) ? data : [];
      setCompanies(companiesArray);
    } catch (error) {
      console.error('❌ Error fetching companies:', error);
      toast({
        title: "Error fetching companies",
        description: "Failed to load companies from the server.",
        variant: "destructive"
      });
      setCompanies([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterCompanies = () => {
    let filtered = companies;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchLower) ||
        (company.description || '').toLowerCase().includes(searchLower) ||
        (company.location || '').toLowerCase().includes(searchLower) ||
        company.contactEmail.toLowerCase().includes(searchLower) ||
        company.phoneNumber.toLowerCase().includes(searchLower)
      );
    }

    setFilteredCompanies(filtered);
  };

  const handleCreateSuccess = () => {
    setShowCreateDialog(false);
    fetchCompanies();
  };

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    setEditingCompany(null);
    fetchCompanies();
  };

  const handleEditCompany = (company: CompanyType) => {
    setEditingCompany(company);
    setShowEditDialog(true);
  };

  const handleDeleteCompany = async (companyId: string) => {
    if (!confirm('Are you sure you want to delete this company? This action cannot be undone.')) {
      return;
    }

    try {
      console.log('🗑️ Deleting company:', companyId);
      await companiesAPI.delete(companyId);
      setCompanies(prev => prev.filter(company => company._id !== companyId));
      toast({
        title: "Company deleted successfully",
        description: "The company has been removed.",
      });
    } catch (error) {
      console.error('❌ Error deleting company:', error);
      toast({
        title: "Error deleting company",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">Loading companies...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Companies Management"
        description="Manage companies and their information"
        onRefresh={fetchCompanies}
        action={
          <PermissionWrapper resource="companies" action="create">
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Company
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Company</DialogTitle>
                </DialogHeader>
                <CreateCompanyForm onSuccess={handleCreateSuccess} />
              </DialogContent>
            </Dialog>
          </PermissionWrapper>
        }
      />

      <EnhancedFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search by name, description, location, or contact info..."
        filters={[]}
        onClearFilters={() => {
          setSearchTerm('');
        }}
      />

      <div className="space-y-4">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map((company) => (
            <Card key={company._id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={company.logo} />
                      <AvatarFallback>
                        {company.name ? company.name.charAt(0) : '?'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {company.name}
                        </h3>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4" />
                          <span>{company.website || 'N/A'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>{company.contactEmail}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>{company.phoneNumber}</span>
                        </div>
                        {company.location && (
                          <div className="text-xs text-muted-foreground">
                            Location: {company.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <PermissionWrapper resource="companies" action="update" fallback={null}>
                        <DropdownMenuItem onClick={() => handleEditCompany(company)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      </PermissionWrapper>
                      <PermissionWrapper resource="companies" action="delete" fallback={null}>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteCompany(company._id!)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </PermissionWrapper>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-semibold mb-2">No Companies Found</h3>
              <p className="text-muted-foreground">
                {companies.length === 0 
                  ? "No companies have been created yet." 
                  : "No companies match your current search criteria."
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Company Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
          </DialogHeader>
          {editingCompany && (
            <EditCompanyForm
              company={editingCompany}
              onSuccess={handleEditSuccess}
              onCancel={() => {
                setShowEditDialog(false);
                setEditingCompany(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompaniesTab;
