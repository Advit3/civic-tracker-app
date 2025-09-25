import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Map, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    // Redirect to complaints page by default
    navigate('/dashboard/complaints');
  }, [navigate]);

  const cards = [
    {
      title: t('complaints'),
      description: 'Manage citizen complaints and issues',
      icon: FileText,
      path: '/dashboard/complaints'
    },
    {
      title: t('mapView'),
      description: 'View complaints on interactive map',
      icon: Map,
      path: '/dashboard/map'
    },
    {
      title: t('analytics'),
      description: 'View reports and analytics',
      icon: BarChart3,
      path: '/dashboard/analytics'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t('dashboard')}
        </h1>
        <p className="text-muted-foreground">
          Government Complaints Management System
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Card 
            key={card.path}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(card.path)}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <card.icon className="h-6 w-6 text-primary" />
                <CardTitle>{card.title}</CardTitle>
              </div>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;