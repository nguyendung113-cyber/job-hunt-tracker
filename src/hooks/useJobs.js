import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

/**
 * Custom hook for job CRUD operations
 * @param {string} userId - Current user ID
 * @returns {Object} - Jobs state and CRUD methods
 */
export const useJobs = (userId) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch jobs from Supabase
  const fetchJobs = useCallback(async () => {
    if (!userId) {
      console.log("Chưa đăng nhập - useJobs");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("applications")
        .select(
          `
          *,
          companies (id, name, website),
          resumes (id, version_name)
        `,
        )
        .eq("user_id", userId)
        .order("applied_at", { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setJobs(data || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(err.message);
      toast.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch jobs when userId changes
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Add new job
  const addJob = async (jobData) => {
    setLoading(true);

    try {
      const { data, error: insertError } = await supabase
        .from("jobs")
        .insert([jobData])
        .select();

      if (insertError) {
        throw insertError;
      }

      toast.success("Đã thêm công việc mới! 🇯🇵");
      setJobs((prev) => [data[0], ...prev]);
      return { success: true, data: data[0] };
    } catch (err) {
      console.error("Error adding job:", err);
      toast.error(`Lỗi khi lưu: ${err.message}`);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Update job status
  const updateJobStatus = async (jobId, newStatus) => {
    try {
      const { error: updateError } = await supabase
        .from("jobs")
        .update({ status: newStatus })
        .eq("id", jobId);

      if (updateError) {
        throw updateError;
      }

      toast.success("Đã cập nhật trạng thái");
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId ? { ...job, status: newStatus } : job,
        ),
      );
      return { success: true };
    } catch (err) {
      console.error("Error updating job:", err);
      toast.error(`Cập nhật thất bại: ${err.message}`);
      return { success: false, error: err };
    }
  };

  // Delete job
  const deleteJob = async (jobId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa?")) {
      return { success: false, cancelled: true };
    }

    try {
      const { error: deleteError } = await supabase
        .from("jobs")
        .delete()
        .eq("id", jobId);

      if (deleteError) {
        throw deleteError;
      }

      toast.success("Đã xóa thành công");
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
      return { success: true };
    } catch (err) {
      console.error("Error deleting job:", err);
      toast.error("Lỗi xóa dữ liệu");
      return { success: false, error: err };
    }
  };

  return {
    jobs,
    loading,
    error,
    fetchJobs,
    addJob,
    updateJobStatus,
    deleteJob,
  };
};

export default useJobs;
