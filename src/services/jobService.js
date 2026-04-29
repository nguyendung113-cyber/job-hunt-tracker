import { supabase } from "../lib/supabase";

/**
 * Job Service - Layer tách biệt logic API với UI
 * Chịu trách nhiệm giao tiếp với Supabase
 */

const JOB_TABLE = "jobs";

/**
 * Lấy tất cả jobs của user
 * @param {string} userId - User ID
 * @returns {Promise<{data, error}>}
 */
export const getJobs = async (userId) => {
  if (!userId) {
    return { data: null, error: { message: "User not authenticated" } };
  }

  return await supabase
    .from(JOB_TABLE)
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
};

/**
 * Thêm job mới
 * @param {Object} jobData - Dữ liệu job
 * @returns {Promise<{data, error}>}
 */
export const createJob = async (jobData) => {
  return await supabase.from(JOB_TABLE).insert([jobData]).select();
};

/**
 * Cập nhật job
 * @param {string} jobId - Job ID
 * @param {Object} updates - Dữ liệu cập nhật
 * @returns {Promise<{data, error}>}
 */
export const updateJob = async (jobId, updates) => {
  return await supabase
    .from(JOB_TABLE)
    .update(updates)
    .eq("id", jobId)
    .select();
};

/**
 * Xóa job
 * @param {string} jobId - Job ID
 * @returns {Promise<{data, error}>}
 */
export const deleteJob = async (jobId) => {
  return await supabase.from(JOB_TABLE).delete().eq("id", jobId);
};

/**
 * Cập nhật trạng thái job
 * @param {string} jobId - Job ID
 * @param {string} status - Trạng thái mới
 * @returns {Promise<{data, error}>}
 */
export const updateJobStatus = async (jobId, status) => {
  return await supabase.from(JOB_TABLE).update({ status }).eq("id", jobId);
};

export default {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  updateJobStatus,
};
