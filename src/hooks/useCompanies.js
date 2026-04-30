import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

/**
 * Custom hook for Companies CRUD operations
 * @param {string} userId - Current user ID
 * @returns {Object} - Companies state and CRUD methods
 */
export const useCompanies = (userId) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch companies from Supabase
  const fetchCompanies = useCallback(async () => {
    if (!userId) {
      console.log("Chưa đăng nhập");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("companies")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setCompanies(data || []);
    } catch (err) {
      console.error("Error fetching companies:", err);
      setError(err.message);
      toast.error("Không thể tải danh sách công ty");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch companies when userId changes
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // Add new company
  const addCompany = async (companyData) => {
    setLoading(true);

    try {
      const { data, error: insertError } = await supabase
        .from("companies")
        .insert([{ ...companyData, user_id: userId }])
        .select();

      if (insertError) {
        throw insertError;
      }

      toast.success("Đã thêm công ty mới!");
      setCompanies((prev) => [data[0], ...prev]);
      return { success: true, data: data[0] };
    } catch (err) {
      console.error("Error adding company:", err);
      toast.error(`Lỗi: ${err.message}`);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Update company
  const updateCompany = async (companyId, updates) => {
    try {
      const { data, error: updateError } = await supabase
        .from("companies")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", companyId)
        .select();

      if (updateError) {
        throw updateError;
      }

      toast.success("Đã cập nhật công ty");
      setCompanies((prev) =>
        prev.map((company) => (company.id === companyId ? data[0] : company)),
      );
      return { success: true, data: data[0] };
    } catch (err) {
      console.error("Error updating company:", err);
      toast.error(`Lỗi cập nhật: ${err.message}`);
      return { success: false, error: err };
    }
  };

  // Delete company
  const deleteCompany = async (companyId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa công ty này?")) {
      return { success: false, cancelled: true };
    }

    try {
      const { error: deleteError } = await supabase
        .from("companies")
        .delete()
        .eq("id", companyId);

      if (deleteError) {
        throw deleteError;
      }

      toast.success("Đã xóa công ty");
      setCompanies((prev) =>
        prev.filter((company) => company.id !== companyId),
      );
      return { success: true };
    } catch (err) {
      console.error("Error deleting company:", err);
      toast.error("Lỗi xóa công ty");
      return { success: false, error: err };
    }
  };

  // Get company by ID
  const getCompanyById = (companyId) => {
    return companies.find((company) => company.id === companyId);
  };

  return {
    companies,
    loading,
    error,
    fetchCompanies,
    addCompany,
    updateCompany,
    deleteCompany,
    getCompanyById,
  };
};

export default useCompanies;
