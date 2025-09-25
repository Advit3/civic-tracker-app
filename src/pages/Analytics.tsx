import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, FileText, CheckCircle, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Issue {
  id: number;
  category: string;
  department: string;
  status: string;
  created_at: string;
}

interface IssueUpdate {
  issue_id: number;
  created_at: string;
}

const Analytics = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [issueUpdates, setIssueUpdates] = useState<IssueUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch issues
      const { data: issuesData, error: issuesError } = await supabase
        .from('issues')
        .select('id, category, department, status, created_at');

      if (issuesError) throw issuesError;

      // Fetch issue updates
      const { data: updatesData, error: updatesError } = await supabase
        .from('issue_updates')
        .select('issue_id, created_at');

      if (updatesError) throw updatesError;

      setIssues(issuesData || []);
      setIssueUpdates(updatesData || []);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast({
        title: t('errorOccurred'),
        description: 'Failed to fetch analytics data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalComplaints = issues.length;
  const completedComplaints = issues.filter(issue => issue.status === 'completed').length;
  const pendingComplaints = issues.filter(issue => issue.status === 'pending').length;
  const inProcessComplaints = issues.filter(issue => issue.status === 'in_process').length;

  // Complaints by category
  const categoryData = issues.reduce((acc, issue) => {
    acc[issue.category] = (acc[issue.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(categoryData).map(([category, count]) => ({
    category: category.replace('_', ' ').toUpperCase(),
    count
  }));

  // Complaints by status
  const statusData = issues.reduce((acc, issue) => {
    acc[issue.status] = (acc[issue.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusChartData = Object.entries(statusData).map(([status, count]) => ({
    status: status.replace('_', ' ').toUpperCase(),
    count
  }));

  // Complaints by department
  const departmentData = issues.reduce((acc, issue) => {
    const dept = issue.department || 'general';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const departmentChartData = Object.entries(departmentData).map(([department, count]) => ({
    department: department.replace('_', ' ').toUpperCase(),
    count
  }));

  // Calculate average resolution time (simplified)
  const calculateAverageResolutionTime = () => {
    const completedIssues = issues.filter(issue => issue.status === 'completed');
    if (completedIssues.length === 0) return '0 days';

    const totalDays = completedIssues.reduce((sum, issue) => {
      const created = new Date(issue.created_at);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - created.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return sum + diffDays;
    }, 0);

    const avgDays = Math.round(totalDays / completedIssues.length);
    return `${avgDays} ${t('days')}`;
  };

  const averageResolutionTime = calculateAverageResolutionTime();

  // Chart colors
  const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#06b6d4'];

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t('analytics')}
        </h1>
        <p className="text-muted-foreground">
          Comprehensive analytics and reports for complaint management
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('totalComplaints')}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComplaints}</div>
            <p className="text-xs text-muted-foreground">
              All registered complaints
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('resolvedComplaints')}
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedComplaints}</div>
            <p className="text-xs text-muted-foreground">
              Successfully resolved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('pendingComplaints')}
            </CardTitle>
            <Clock className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{pendingComplaints}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting action
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('averageResolutionTime')}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageResolutionTime}</div>
            <p className="text-xs text-muted-foreground">
              Average time to resolve
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Complaints by Category */}
        <Card>
          <CardHeader>
            <CardTitle>{t('complaintsByCategory')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="category" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Complaints by Status */}
        <Card>
          <CardHeader>
            <CardTitle>{t('complaintsByStatus')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Complaints by Department */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Complaints by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="department" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { status: 'pending', label: t('pending'), count: pendingComplaints, color: 'bg-red-100 text-red-800' },
              { status: 'acknowledged', label: t('acknowledged'), count: statusData.acknowledged || 0, color: 'bg-yellow-100 text-yellow-800' },
              { status: 'in_process', label: t('inProcess'), count: inProcessComplaints, color: 'bg-blue-100 text-blue-800' },
              { status: 'completed', label: t('completed'), count: completedComplaints, color: 'bg-green-100 text-green-800' },
              { status: 'rejected', label: t('rejected'), count: statusData.rejected || 0, color: 'bg-gray-100 text-gray-800' }
            ].map(({ status, label, count, color }) => (
              <div key={status} className="text-center">
                <Badge className={`${color} text-lg px-4 py-2 mb-2`}>
                  {count}
                </Badge>
                <p className="text-sm font-medium">{label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {totalComplaints === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BarChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No data available for analytics</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Analytics;