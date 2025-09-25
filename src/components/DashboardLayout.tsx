import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import { 
  FileText, 
  Map, 
  BarChart3, 
  LogOut, 
  Globe,
  Menu
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const menuItems = [
    { 
      title: t('complaints'), 
      icon: FileText, 
      path: '/dashboard/complaints',
      isActive: location.pathname.includes('/complaints')
    },
    { 
      title: t('mapView'), 
      icon: Map, 
      path: '/dashboard/map',
      isActive: location.pathname.includes('/map')
    },
    { 
      title: t('analytics'), 
      icon: BarChart3, 
      path: '/dashboard/analytics',
      isActive: location.pathname.includes('/analytics')
    },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b border-sidebar-border">
          {!collapsed && (
            <h2 className="text-lg font-semibold text-sidebar-foreground">
              {t('dashboard')}
            </h2>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>{!collapsed && 'Navigation'}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    className={item.isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''}
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 space-y-2 border-t border-sidebar-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="w-full justify-start gap-2"
          >
            <Globe className="h-4 w-4" />
            {!collapsed && (language === 'en' ? 'हिंदी' : 'English')}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start gap-2 text-destructive hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && t('logout')}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b bg-background px-4">
            <SidebarTrigger />
          </header>
          
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;