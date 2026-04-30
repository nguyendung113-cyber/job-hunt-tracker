import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import { calculateStats } from "../utils/stats.js";

/**
 * Custom hook for Applications CRUD với Real-time subscription
 * @param {string} userId - Current user ID
 * @returns {Object} - Applications state and CRUD methods
 */
export const useApplications = (userId) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false);

  const channelRef = useRef(null);

  // =====================================================
  // 1. FETCH APPLICATIONS (với JOIN từ companies)
  // =====================================================
  const fetchApplications = useCallback(async () => {
    if (!userId) {
      console.log("Chưa đăng nhập");
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

      setApplications(data || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError(err.message);
      toast.error("Không thể tải danh sách ứng tuyển");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // =====================================================
  // 2. REAL-TIME SUBSCRIPTION (sử dụng supabase.channel())
  // =====================================================
  const subscribeToApplications = useCallback(() => {
    if (!userId || channelRef.current) {
      return;
    }

    // Tạo channel cho real-time updates
    const channel = supabase.channel(`applications:${userId}`, {
      config: {
        broadcast: { self: false },
        presence: { key: userId },
      },
    });

    // Lắng nghe INSERT event
    channel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "applications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("📥 INSERT received:", payload);

          // Fetch chi tiết của record mới (bao gồm join data)
          supabase
            .from("applications")
            .select(
              `
            *,
            companies (id, name, website),
            resumes (id, version_name)
          `,
            )
            .eq("id", payload.new.id)
            .single()
            .then(({ data: newApp }) => {
              if (newApp) {
                setApplications((prev) => [newApp, ...prev]);
                toast.success("Có đơn ứng tuyển mới!");
              }
            });
        },
      )

      // Lắng nghe UPDATE event
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "applications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("📝 UPDATE received:", payload);

          // Fetch record đã được cập nhật
          supabase
            .from("applications")
            .select(
              `
            *,
            companies (id, name, website),
            resumes (id, version_name)
          `,
            )
            .eq("id", payload.new.id)
            .single()
            .then(({ data: updatedApp }) => {
              if (updatedApp) {
                setApplications((prev) =>
                  prev.map((app) =>
                    app.id === updatedApp.id ? updatedApp : app,
                  ),
                );
                toast.success("Đơn ứng tuyển được cập nhật!");
              }
            });
        },
      )

      // Lắng nghe DELETE event
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "applications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("🗑️ DELETE received:", payload);

          setApplications((prev) =>
            prev.filter((app) => app.id !== payload.old.id),
          );
          toast.success("Đơn ứng tuyển đã bị xóa");
        },
      )

      // Subscribe channel
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("✅ Real-time subscribed to applications");
          setIsRealTimeEnabled(true);
        } else {
          console.log("❌ Subscription status:", status);
          setIsRealTimeEnabled(false);
        }
      });

    channelRef.current = channel;
  }, [userId]);

  // =====================================================
  // 3. UNSUBSCRIBE (cleanup khi unmount hoặc userId thay đổi)
  // =====================================================
  const unsubscribe = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      setIsRealTimeEnabled(false);
      console.log("🔌 Unsubscribed from applications");
    }
  }, []);

  // =====================================================
  // 4. SETUP EFFECT
  // =====================================================
  useEffect(() => {
    fetchApplications();
    subscribeToApplications();

    // Cleanup khi component unmount hoặc userId thay đổi
    return () => {
      unsubscribe();
    };
  }, [fetchApplications, subscribeToApplications, unsubscribe]);

  // =====================================================
  // 5. CRUD METHODS
  // =====================================================

  // Add new application
  const addApplication = async (applicationData) => {
    setLoading(true);

    try {
      const { data, error: insertError } = await supabase
        .from("applications")
        .insert([{ ...applicationData, user_id: userId }]).select(`
          *,
          companies (id, name, website),
          resumes (id, version_name)
        `);

      if (insertError) {
        throw insertError;
      }

      toast.success("Đã thêm đơn ứng tuyển mới!");
      return { success: true, data: data[0] };
    } catch (err) {
      console.error("Error adding application:", err);
      toast.error(`Lỗi: ${err.message}`);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Update application status
  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const { data, error: updateError } = await supabase
        .from("applications")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", applicationId).select(`
          *,
          companies (id, name, website),
          resumes (id, version_name)
        `);

      if (updateError) {
        throw updateError;
      }

      toast.success("Đã cập nhật trạng thái");
      return { success: true, data: data[0] };
    } catch (err) {
      console.error("Error updating application:", err);
      toast.error(`Lỗi cập nhật: ${err.message}`);
      return { success: false, error: err };
    }
  };

  // Update application
  const updateApplication = async (applicationId, updates) => {
    try {
      const { data, error: updateError } = await supabase
        .from("applications")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", applicationId).select(`
          *,
          companies (id, name, website),
          resumes (id, version_name)
        `);

      if (updateError) {
        throw updateError;
      }

      toast.success("Đã cập nhật đơn ứng tuyển");
      return { success: true, data: data[0] };
    } catch (err) {
      console.error("Error updating application:", err);
      toast.error(`Lỗi cập nhật: ${err.message}`);
      return { success: false, error: err };
    }
  };

  // Delete application
  const deleteApplication = async (applicationId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đơn ứng tuyển này?")) {
      return { success: false, cancelled: true };
    }

    try {
      const { error: deleteError } = await supabase
        .from("applications")
        .delete()
        .eq("id", applicationId);

      if (deleteError) {
        throw deleteError;
      }

      toast.success("Đã xóa đơn ứng tuyển");
      return { success: true };
    } catch (err) {
      console.error("Error deleting application:", err);
      toast.error("Lỗi xóa đơn ứng tuyển");
      return { success: false, error: err };
    }
  };

  // Get applications by status
  const getApplicationsByStatus = (status) => {
    return applications.filter((app) => app.status === status);
  };

  // Get statistics
  const getStatistics = useCallback(() => {
    return calculateStats(applications);
  }, [applications]);

  // Manual refresh (force fetch)
  const refresh = useCallback(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    // State
    applications,
    loading,
    error,
    isRealTimeEnabled,

    // Methods
    fetchApplications,
    addApplication,
    updateApplicationStatus,
    updateApplication,
    deleteApplication,
    getApplicationsByStatus,
    getStatistics,
    refresh,
    unsubscribe,
  };
};

export default useApplications;
