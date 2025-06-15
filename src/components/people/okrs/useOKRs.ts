
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { OKR, KeyResult } from "./types";

export const useOKRs = () => {
  const { user } = useAuth();
  const [okrs, setOkrs] = useState<OKR[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOKRs = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('okrs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to match our interface with proper type safety
      const transformedOkrs: OKR[] = data?.map(item => ({
        ...item,
        key_results: Array.isArray(item.key_results) ? 
          (item.key_results as unknown as KeyResult[]) : []
      })) || [];
      
      setOkrs(transformedOkrs);
    } catch (error) {
      console.error('Error fetching OKRs:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveOKR = async (okrData: any, editingOkr?: OKR | null) => {
    if (!user) return;

    try {
      const dataToSave = {
        ...okrData,
        key_results: okrData.key_results as any, // Type assertion for JSON storage
        user_id: user.id
      };

      if (editingOkr) {
        const { error } = await supabase
          .from('okrs')
          .update(dataToSave)
          .eq('id', editingOkr.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('okrs')
          .insert([dataToSave]);
        
        if (error) throw error;
      }

      fetchOKRs();
    } catch (error) {
      console.error('Error saving OKR:', error);
    }
  };

  const deleteOKR = async (id: string) => {
    try {
      const { error } = await supabase
        .from('okrs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchOKRs();
    } catch (error) {
      console.error('Error deleting OKR:', error);
    }
  };

  useEffect(() => {
    fetchOKRs();
  }, [user]);

  return {
    okrs,
    loading,
    saveOKR,
    deleteOKR,
    fetchOKRs
  };
};
