import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

/**
 * Custom hook for Resumes CRUD operations
 * @param {string} userId - Current user ID
 * @returns {Object} - Resumes state and CRUD methods
 */
export const useResumes = (userId) => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch resumes from Supabase
  const fetchResumes = useCallback(async () => {
    if (!userId) {
      console.log("Chưa đăng nhập");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setResumes(data || []);
    } catch (err) {
      console.error("Error fetching resumes:", err);
      setError(err.message);
      toast.error("Không thể tải danh sách CV");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch resumes when userId changes
  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  // Add new resume
  const addResume = async (resumeData) => {
    setLoading(true);

    try {
      const { data, error: insertError } = await supabase
        .from("resumes")
        .insert([{ ...resumeData, user_id: userId }])
        .select();

      if (insertError) {
        throw insertError;
      }

      toast.success("Đã thêm CV mới!");
      setResumes((prev) => [data[0], ...prev]);
      return { success: true, data: data[0] };
    } catch (err) {
      console.error("Error adding resume:", err);
      toast.error(`Lỗi: ${err.message}`);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Update resume
  const updateResume = async (resumeId, updates) => {
    try {
      const { data, error: updateError } = await supabase
        .from("resumes")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", resumeId)
        .select();

      if (updateError) {
        throw updateError;
      }

      toast.success("Đã cập nhật CV");
      setResumes((prev) =>
        prev.map((resume) => (resume.id === resumeId ? data[0] : resume)),
      );
      return { success: true, data: data[0] };
    } catch (err) {
      console.error("Error updating resume:", err);
      toast.error(`Lỗi cập nhật: ${err.message}`);
      return { success: false, error: err };
    }
  };

  // Set active resume
  const setActiveResume = async (resumeId) => {
    try {
      // First, set all resumes to inactive
      await supabase
        .from("resumes")
        .update({ is_active: false })
        .eq("user_id", userId);

      // Then, set the selected resume as active
      const { error: updateError } = await supabase
        .from("resumes")
        .update({ is_active: true })
        .eq("id", resumeId);

      if (updateError) {
        throw updateError;
      }

      toast.success("Đã đặt CV mặc định");
      setResumes((prev) =>
        prev.map((resume) => ({
          ...resume,
          is_active: resume.id === resumeId,
        })),
      );
      return { success: true };
    } catch (err) {
      console.error("Error setting active resume:", err);
      toast.error("Lỗi cập nhật CV mặc định");
      return { success: false, error: err };
    }
  };

  // Delete resume
  const deleteResume = async (resumeId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa CV này?")) {
      return { success: false, cancelled: true };
    }

    try {
      const { error: deleteError } = await supabase
        .from("resumes")
        .delete()
        .eq("id", resumeId);

      if (deleteError) {
        throw deleteError;
      }

      toast.success("Đã xóa CV");
      setResumes((prev) => prev.filter((resume) => resume.id !== resumeId));
      return { success: true };
    } catch (err) {
      console.error("Error deleting resume:", err);
      toast.error("Lỗi xóa CV");
      return { success: false, error: err };
    }
  };

  // Get active resume
  const getActiveResume = () => {
    return resumes.find((resume) => resume.is_active) || resumes[0];
  };

  return {
    resumes,
    loading,
    error,
    fetchResumes,
    addResume,
    updateResume,
    setActiveResume,
    deleteResume,
    getActiveResume,
  };
};

export default useResumes;
