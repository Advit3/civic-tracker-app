import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Auth
    login: 'Login',
    email: 'Email',
    password: 'Password',
    loginButton: 'Sign In',
    logout: 'Sign Out',
    invalidCredentials: 'Invalid credentials',
    
    // Navigation
    dashboard: 'Dashboard',
    complaints: 'Complaints',
    mapView: 'Map View',
    analytics: 'Analytics & Reports',
    
    // Complaints
    complaintId: 'Complaint ID',
    photo: 'Photo',
    category: 'Category',
    department: 'Department',
    location: 'Location',
    status: 'Status',
    date: 'Date',
    description: 'Description',
    searchComplaints: 'Search complaints...',
    filterByCategory: 'Filter by Category',
    filterByDepartment: 'Filter by Department',
    filterByStatus: 'Filter by Status',
    sortByDate: 'Sort by Date',
    
    // Status
    pending: 'Pending',
    acknowledged: 'Acknowledged',
    inProcess: 'In Process',
    completed: 'Completed',
    rejected: 'Rejected',
    
    // Departments
    waterSupply: 'Water Supply',
    electricity: 'Electricity',
    roadsTransport: 'Roads & Transport',
    sanitation: 'Sanitation',
    healthcare: 'Healthcare',
    education: 'Education',
    security: 'Security',
    environment: 'Environment',
    general: 'General',
    
    // Categories
    infrastructure: 'Infrastructure',
    utilities: 'Utilities',
    publicServices: 'Public Services',
    safety: 'Safety',
    environmental: 'Environmental',
    
    // Map
    viewOnMap: 'View on Map',
    
    // Analytics
    complaintsByCategory: 'Complaints by Category',
    complaintsByStatus: 'Complaints by Status',
    averageResolutionTime: 'Average Resolution Time',
    totalComplaints: 'Total Complaints',
    resolvedComplaints: 'Resolved Complaints',
    pendingComplaints: 'Pending Complaints',
    
    // Actions
    updateStatus: 'Update Status',
    changeDepartment: 'Change Department',
    viewDetails: 'View Details',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    
    // Time
    days: 'days',
    hours: 'hours',
    minutes: 'minutes',
    
    // Messages
    statusUpdated: 'Status updated successfully',
    departmentChanged: 'Department changed successfully',
    errorOccurred: 'An error occurred',
    noComplaints: 'No complaints found',
    loadingComplaints: 'Loading complaints...',
  },
  hi: {
    // Auth
    login: 'लॉगिन',
    email: 'ईमेल',
    password: 'पासवर्ड',
    loginButton: 'साइन इन',
    logout: 'साइन आउट',
    invalidCredentials: 'अमान्य क्रेडेंशियल',
    
    // Navigation
    dashboard: 'डैशबोर्ड',
    complaints: 'शिकायतें',
    mapView: 'मैप व्यू',
    analytics: 'एनालिटिक्स और रिपोर्ट',
    
    // Complaints
    complaintId: 'शिकायत आईडी',
    photo: 'फोटो',
    category: 'श्रेणी',
    department: 'विभाग',
    location: 'स्थान',
    status: 'स्थिति',
    date: 'दिनांक',
    description: 'विवरण',
    searchComplaints: 'शिकायतें खोजें...',
    filterByCategory: 'श्रेणी के अनुसार फिल्टर करें',
    filterByDepartment: 'विभाग के अनुसार फिल्टर करें',
    filterByStatus: 'स्थिति के अनुसार फिल्टर करें',
    sortByDate: 'दिनांक के अनुसार क्रमबद्ध करें',
    
    // Status
    pending: 'लंबित',
    acknowledged: 'स्वीकृत',
    inProcess: 'प्रगति में',
    completed: 'पूर्ण',
    rejected: 'अस्वीकृत',
    
    // Departments
    waterSupply: 'जल आपूर्ति',
    electricity: 'बिजली',
    roadsTransport: 'सड़क और परिवहन',
    sanitation: 'स्वच्छता',
    healthcare: 'स्वास्थ्य सेवा',
    education: 'शिक्षा',
    security: 'सुरक्षा',
    environment: 'पर्यावरण',
    general: 'सामान्य',
    
    // Categories
    infrastructure: 'बुनियादी ढांचा',
    utilities: 'उपयोगिताएं',
    publicServices: 'सार्वजनिक सेवाएं',
    safety: 'सुरक्षा',
    environmental: 'पर्यावरणीय',
    
    // Map
    viewOnMap: 'मैप पर देखें',
    
    // Analytics
    complaintsByCategory: 'श्रेणी के अनुसार शिकायतें',
    complaintsByStatus: 'स्थिति के अनुसार शिकायतें',
    averageResolutionTime: 'औसत समाधान समय',
    totalComplaints: 'कुल शिकायतें',
    resolvedComplaints: 'हल की गई शिकायतें',
    pendingComplaints: 'लंबित शिकायतें',
    
    // Actions
    updateStatus: 'स्थिति अपडेट करें',
    changeDepartment: 'विभाग बदलें',
    viewDetails: 'विवरण देखें',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    close: 'बंद करें',
    
    // Time
    days: 'दिन',
    hours: 'घंटे',
    minutes: 'मिनट',
    
    // Messages
    statusUpdated: 'स्थिति सफलतापूर्वक अपडेट की गई',
    departmentChanged: 'विभाग सफलतापूर्वक बदला गया',
    errorOccurred: 'एक त्रुटि हुई',
    noComplaints: 'कोई शिकायत नहीं मिली',
    loadingComplaints: 'शिकायतें लोड हो रही हैं...',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};