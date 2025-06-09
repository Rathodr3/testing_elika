
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, Building2, Globe, Mail, Phone } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CreateCompanyForm from './CreateCompanyForm';
import EditCompanyForm from './EditCompanyForm';
import { companiesAPI, Company } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const CompaniesTab = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [companies, searchTerm]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await companiesAPI.getAll();
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({
        title: "Error fetching companies",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterCompanies = () => {
    let filtered = companies;

    if (searchTerm) {
      filtered = filtered.filter(company => 
        company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCompanies(filtered);
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setShowEditDialog(true);
  };

  const handleDeleteCompany = async (companyId: string) => {
    if (!confirm('Are you sure you want to delete this company?')) return;

    try {
      await companiesAPI.delete(companyId);
      toast({
        title: "Company deleted successfully",
        description: "The company has been removed from the system",
      });
      fetchCompanies();
    } catch (error) {
      console.error('Error deleting company:', error);
      toast({
        title: "Error deleting company",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    setEditingCompany(null);
    fetchCompanies();
  };

  if (loading) {
    return <div className="text-center py-8">Loading companies...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Company
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Company</DialogTitle>
                </DialogHeader>
                <CreateCompanyForm 
                  onSuccess={() => {
                    setShowCreateDialog(false);
                    fetchCompanies();
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Companies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Companies ({filteredCompanies.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((company) => (
                <TableRow key={company._id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {company.logo ? (
                          <img src={company.logo} alt={company.name} className="w-8 h-8 rounded" />
                        ) : (
                          <Building2 className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{company.name}</div>
                        {company.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {company.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {company.contactEmail}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {company.phoneNumber}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {company.website && (
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-2 text-gray-400" />
                        <a 
                          href={company.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {company.website}
                        </a>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={company.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {company.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditCompany(company)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteCompany(company._id!)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredCompanies.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No companies found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Company Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
          </DialogHeader>
          {editingCompany && (
            <EditCompanyForm 
              company={editingCompany}
              onSuccess={handleEditSuccess}
              onCancel={() => setShowEditDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompaniesTab;
