import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Eye, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Issue {
  id: number;
  user_id: string;
  category: string;
  department: string;
  image_url: string;
  location: string;
  status: string;
  created_at: string;
  description: string;
}

const Complaints = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: t('pending') },
    { value: 'acknowledged', label: t('acknowledged') },
    { value: 'in_process', label: t('inProcess') },
    { value: 'completed', label: t('completed') },
    { value: 'rejected', label: t('rejected') }
  ];

  const departmentOptions = [
    { value: 'all', label: 'All' },
    { value: 'water_supply', label: t('waterSupply') },
    { value: 'electricity', label: t('electricity') },
    { value: 'roads_transport', label: t('roadsTransport') },
    { value: 'sanitation', label: t('sanitation') },
    { value: 'healthcare', label: t('healthcare') },
    { value: 'education', label: t('education') },
    { value: 'security', label: t('security') },
    { value: 'environment', label: t('environment') },
    { value: 'general', label: t('general') }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All' },
    { value: 'infrastructure', label: t('infrastructure') },
    { value: 'utilities', label: t('utilities') },
    { value: 'public_services', label: t('publicServices') },
    { value: 'safety', label: t('safety') },
    { value: 'environmental', label: t('environmental') }
  ];

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIssues(data || []);
    } catch (error) {
      console.error('Error fetching issues:', error);
      toast({
        title: t('errorOccurred'),
        description: 'Failed to fetch complaints',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateIssueStatus = async (issueId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('issues')
        .update({ status: newStatus })
        .eq('id', issueId);

      if (error) throw error;

      // Create issue update record
      await supabase
        .from('issue_updates')
        .insert({
          issue_id: issueId,
          message: `Status updated to ${newStatus}`
        });

      setIssues(prev => prev.map(issue => 
        issue.id === issueId ? { ...issue, status: newStatus } : issue
      ));

      toast({
        title: t('statusUpdated'),
        description: `Status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: t('errorOccurred'),
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const updateIssueDepartment = async (issueId: number, newDepartment: any) => {
    try {
      const { error } = await supabase
        .from('issues')
        .update({ department: newDepartment })
        .eq('id', issueId);

      if (error) throw error;

      setIssues(prev => prev.map(issue => 
        issue.id === issueId ? { ...issue, department: newDepartment } : issue
      ));

      toast({
        title: t('departmentChanged'),
        description: `Department changed to ${newDepartment}`,
      });
    } catch (error) {
      console.error('Error updating department:', error);
      toast({
        title: t('errorOccurred'),
        description: 'Failed to update department',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'acknowledged':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_process':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.id.toString().includes(searchTerm) ||
                         issue.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || issue.category === categoryFilter;
    const matchesDepartment = departmentFilter === 'all' || issue.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesDepartment;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('loadingComplaints')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t('complaints')}
        </h1>
        <p className="text-muted-foreground">
          Manage citizen complaints and track their resolution
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('searchComplaints')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('filterByStatus')} />
              </SelectTrigger>
              <SelectContent>package.json
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('filterByCategory')} />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('filterByDepartment')} />
              </SelectTrigger>
              <SelectContent>
                {departmentOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setCategoryFilter('all');
                setDepartmentFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Complaints Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('complaintId')}</TableHead>
                <TableHead>{t('photo')}</TableHead>
                <TableHead>{t('category')}</TableHead>
                <TableHead>{t('department')}</TableHead>
                <TableHead>{t('location')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead>{t('date')}</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIssues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-muted-foreground">{t('noComplaints')}</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredIssues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell className="font-medium">#{issue.id}</TableCell>
                    <TableCell>
                      {issue.image_url ? (
                        <img 
                          src={issue.image_url} 
                          alt="Complaint" 
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">No Image</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{issue.category}</TableCell>
                    <TableCell>
                      <Select 
                        value={issue.department} 
                        onValueChange={(value) => updateIssueDepartment(issue.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {departmentOptions.slice(1).map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="max-w-32 truncate">{issue.location}</TableCell>
                    <TableCell>
                      <Select 
                        value={issue.status} 
                        onValueChange={(value) => updateIssueStatus(issue.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.slice(1).map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(issue.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedIssue(issue);
                          setDetailDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Issue Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {t('complaintId')} #{selectedIssue?.id}
            </DialogTitle>
          </DialogHeader>
          
          {selectedIssue && (
            <div className="space-y-4">
              {selectedIssue.image_url && (
                <div>
                  <img 
                    src={selectedIssue.image_url} 
                    alt="Complaint" 
                    className="w-full max-h-64 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {t('category')}
                  </label>
                  <p className="mt-1">{selectedIssue.category}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {t('department')}
                  </label>
                  <p className="mt-1">{selectedIssue.department}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {t('status')}
                  </label>
                  <Badge className={`mt-1 ${getStatusColor(selectedIssue.status)}`}>
                    {selectedIssue.status}
                  </Badge>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {t('date')}
                  </label>
                  <p className="mt-1">
                    {new Date(selectedIssue.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('location')}
                </label>
                <p className="mt-1">{selectedIssue.location}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('description')}
                </label>
                <p className="mt-1 text-sm leading-relaxed">
                  {selectedIssue.description}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Complaints;