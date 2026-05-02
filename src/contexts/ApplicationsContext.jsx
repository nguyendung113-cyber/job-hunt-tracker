import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../lib/supabase";
import { applicationService } from "../services/applicationService";
import { calculateStats } from "../utils/stats";
import toast from "react-hot-toast";

import { useAuth } from "../hooks/useAuth";

const ApplicationsContext = createContext();

export const ApplicationsProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id;
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false);
  const channelRef = useRef(null);

  const fetchApplications = useCallback(async () => {
    if (!userId) {
      setApplications([]);
      return;
    }

    setLoading(true);
    try {
      const data = await applicationService.getAll(userId);
      setApplications(data);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const subscribeToApplications = useCallback(() => {
    if (!userId || channelRef.current) return;

    const channel = supabase.channel(`applications-global:${userId}`, {
      config: {
        broadcast: { self: true },
        presence: { key: userId },
      },
    });

    channel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "applications",
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          setApplications((prev) => {
            if (prev.some((app) => app.id === payload.new.id)) return prev;
            applicationService.getById(payload.new.id).then((newApp) => {
              setApplications((current) => [newApp, ...current]);
              toast.success("Có đơn ứng tuyển mới!");
            });
            return prev;
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "applications",
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          const updatedApp = await applicationService.getById(payload.new.id);
          setApplications((prev) =>
            prev.map((app) => (app.id === updatedApp.id ? updatedApp : app))
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "applications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setApplications((prev) => prev.filter((app) => app.id !== payload.old.id));
        }
      )
      .subscribe((status) => {
        setIsRealTimeEnabled(status === "SUBSCRIBED");
      });

    channelRef.current = channel;
  }, [userId]);

  const unsubscribe = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      setIsRealTimeEnabled(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
    subscribeToApplications();
    return () => unsubscribe();
  }, [fetchApplications, subscribeToApplications, unsubscribe]);

  const addApplication = async (applicationData) => {
    setLoading(true);
    try {
      const data = await applicationService.create(applicationData, userId);
      setApplications((prev) => [data, ...prev]);
      toast.success("Đã thêm đơn ứng tuyển thành công!");
      return { success: true, data };
    } catch (err) {
      console.error("Error adding application:", err);
      toast.error(`Lỗi: ${err.message}`);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const data = await applicationService.updateStatus(applicationId, newStatus);
      setApplications((prev) =>
        prev.map((app) => (app.id === applicationId ? data : app))
      );
      return { success: true, data };
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error(`Lỗi cập nhật: ${err.message}`);
      return { success: false, error: err };
    }
  };

  const updateApplication = async (applicationId, updates) => {
    try {
      const data = await applicationService.update(applicationId, updates);
      setApplications((prev) =>
        prev.map((app) => (app.id === applicationId ? data : app))
      );
      toast.success("Cập nhật thành công!");
      return { success: true, data };
    } catch (err) {
      console.error("Error updating application:", err);
      toast.error(`Lỗi: ${err.message}`);
      return { success: false, error: err };
    }
  };

  const deleteApplication = async (applicationId) => {
    try {
      await applicationService.delete(applicationId);
      setApplications((prev) => prev.filter((app) => app.id !== applicationId));
      toast.success("Đã xóa đơn ứng tuyển thành công!");
      return { success: true };
    } catch (err) {
      console.error("Error deleting application:", err);
      toast.error("Lỗi xóa đơn ứng tuyển");
      return { success: false, error: err };
    }
  };

  const toggleFavoriteApplication = async (applicationId, currentStatus) => {
    try {
      const data = await applicationService.toggleFavorite(applicationId, currentStatus);
      setApplications((prev) =>
        prev.map((app) => (app.id === applicationId ? data : app))
      );
      toast.success(data.is_favorite ? "Đã thêm vào yêu thích!" : "Đã bỏ yêu thích");
      return { success: true, data };
    } catch (err) {
      console.error("Error toggling favorite:", err);
      toast.error("Lỗi cập nhật yêu thích");
      return { success: false, error: err };
    }
  };

  const getStatistics = useCallback(() => {
    return calculateStats(applications);
  }, [applications]);

  const value = {
    applications,
    loading,
    error,
    isRealTimeEnabled,
    addApplication,
    updateApplicationStatus,
    updateApplication,
    deleteApplication,
    toggleFavoriteApplication,
    getStatistics,
    refresh: fetchApplications,
  };

  return (
    <ApplicationsContext.Provider value={value}>
      {children}
    </ApplicationsContext.Provider>
  );
};

export const useApplicationsContext = () => {
  const context = useContext(ApplicationsContext);
  if (!context) {
    throw new Error("useApplicationsContext must be used within ApplicationsProvider");
  }
  return context;
};
