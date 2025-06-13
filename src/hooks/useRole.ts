import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import useUser from './useUser';

export function useRole() {
  const { user } = useUser(); // destructure user here
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching role:', error.message);
        return;
      }

      setRole(data.role);
    };

    fetchRole();
  }, [user]);

  return role;
}
