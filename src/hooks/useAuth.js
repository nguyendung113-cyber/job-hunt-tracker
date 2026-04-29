import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

/**
 * Custom hook for authentication management
 * @returns {Object} - Auth state and methods
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current session
  const fetchSession = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    } catch (error) {
      console.error('Error fetching session:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Subscribe to auth state changes
  useEffect(() => {
    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchSession]);

  // Login method
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(`Đăng nhập thất bại: ${error.message}`);
      return { success: false, error };
    }

    toast.success('Chào mừng bạn quay trở lại! 🇯🇵');
    return { success: true, data };
  };

  // Signup method
  const signup = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error(`Lỗi đăng ký: ${error.message}`);
      return { success: false, error };
    }

    toast.success('Đăng ký thành công! Hãy bắt đầu hành trình sự nghiệp.');
    return { success: true, data };
  };

  // Logout method
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Có lỗi khi đăng xuất.');
      return { success: false, error };
    }
    toast.success('Đã đăng xuất. Hẹn gặp lại bạn sớm!');
    return { success: true };
  };

  return {
    user,
    loading,
    login,
    signup,
    logout,
  };
};

export default useAuth;