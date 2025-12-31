import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

type AppRole = 'super_admin' | 'content_admin';

interface AdminContextType {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isContentAdmin: boolean;
  role: AppRole | null;
  loading: boolean;
  checkPermission: (permission: string) => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Permission mappings
const SUPER_ADMIN_PERMISSIONS = [
  'manage_admins',
  'manage_lessons',
  'manage_users',
  'manage_resources',
  'manage_challenges',
  'view_analytics',
  'manage_settings',
  'manage_payments',
  'export_data',
  'delete_users',
  'suspend_users',
];

const CONTENT_ADMIN_PERMISSIONS = [
  'manage_lessons',
  'manage_resources',
  'manage_challenges',
  'view_analytics',
  'view_users',
  'export_data',
];

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    fetchRole();
  }, [user, authLoading]);

  const fetchRole = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!error && data) {
      setRole(data.role as AppRole);
    } else {
      setRole(null);
    }
    setLoading(false);
  };

  const isAdmin = role !== null;
  const isSuperAdmin = role === 'super_admin';
  const isContentAdmin = role === 'content_admin';

  const checkPermission = (permission: string): boolean => {
    if (isSuperAdmin) {
      return SUPER_ADMIN_PERMISSIONS.includes(permission);
    }
    if (isContentAdmin) {
      return CONTENT_ADMIN_PERMISSIONS.includes(permission);
    }
    return false;
  };

  return (
    <AdminContext.Provider value={{
      isAdmin,
      isSuperAdmin,
      isContentAdmin,
      role,
      loading,
      checkPermission,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
