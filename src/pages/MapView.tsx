import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Navigation } from 'lucide-react';

interface Issue {
  id: number;
  category: string;
  department: string;
  location: string;
  status: string;
  created_at: string;
  description: string;
  image_url: string;
}

const MapView = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

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
        description: 'Failed to fetch complaints for map',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: 'bg-red-500', text: 'text-white', border: 'border-red-600' };
      case 'acknowledged':
        return { bg: 'bg-yellow-500', text: 'text-white', border: 'border-yellow-600' };
      case 'in_process':
        return { bg: 'bg-blue-500', text: 'text-white', border: 'border-blue-600' };
      case 'completed':
        return { bg: 'bg-green-500', text: 'text-white', border: 'border-green-600' };
      case 'rejected':
        return { bg: 'bg-gray-500', text: 'text-white', border: 'border-gray-600' };
      default:
        return { bg: 'bg-gray-500', text: 'text-white', border: 'border-gray-600' };
    }
  };

  const getStatusCount = (status: string) => {
    return issues.filter(issue => issue.status === status).length;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading map data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t('mapView')}
        </h1>
        <p className="text-muted-foreground">
          Interactive map showing all complaints by location and status
        </p>
      </div>

      {/* Status Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {[
              { status: 'pending', label: t('pending') },
              { status: 'acknowledged', label: t('acknowledged') },
              { status: 'in_process', label: t('inProcess') },
              { status: 'completed', label: t('completed') },
              { status: 'rejected', label: t('rejected') }
            ].map(({ status, label }) => {
              const colors = getStatusColor(status);
              const count = getStatusCount(status);
              return (
                <div key={status} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${colors.bg} border-2 ${colors.border}`} />
                  <span className="text-sm font-medium">{label}</span>
                  <span className="text-sm text-muted-foreground">({count})</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Map Placeholder with Pin Layout */}
      <Card className="min-h-[600px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Complaints Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative bg-slate-50 rounded-lg min-h-[500px] overflow-hidden">
            {/* Map Background Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 opacity-50" />
            
            {/* Map Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />

            {/* Complaint Pins */}
            <div className="relative h-full p-4">
              {issues.map((issue, index) => {
                const colors = getStatusColor(issue.status);
                // Generate pseudo-random positions based on issue ID
                const x = (issue.id * 37) % 80 + 10; // 10-90% from left
                const y = (issue.id * 73) % 70 + 10; // 10-80% from top
                
                return (
                  <div
                    key={issue.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110 z-10`}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    onClick={() => setSelectedIssue(issue)}
                  >
                    <div className={`relative ${colors.bg} ${colors.border} border-2 rounded-full p-2 shadow-lg`}>
                      <MapPin className="h-4 w-4 text-white" />
                      
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                          #{issue.id} - {issue.location}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Map Labels */}
              <div className="absolute top-4 left-4 bg-white/90 rounded-lg p-3 shadow-lg">
                <h3 className="font-semibold text-sm text-gray-800 mb-1">City Map</h3>
                <p className="text-xs text-gray-600">Click pins to view complaint details</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Issue Details */}
      {selectedIssue && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {t('complaintId')} #{selectedIssue.id}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedIssue.image_url && (
                <div className="md:col-span-2">
                  <img 
                    src={selectedIssue.image_url} 
                    alt="Complaint" 
                    className="w-full max-h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('location')}
                </label>
                <p className="mt-1 font-medium">{selectedIssue.location}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('status')}
                </label>
                <div className="mt-1">
                  <Badge className={getStatusColor(selectedIssue.status).bg + ' ' + getStatusColor(selectedIssue.status).text}>
                    {selectedIssue.status}
                  </Badge>
                </div>
              </div>
              
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
              
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">
                  {t('description')}
                </label>
                <p className="mt-1 text-sm leading-relaxed">
                  {selectedIssue.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {issues.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t('noComplaints')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MapView;