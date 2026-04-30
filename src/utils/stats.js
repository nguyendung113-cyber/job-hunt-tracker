import { JOB_STATUS } from "../constants/jobStatus.js";

/**
 * Calculates statistics for applications
 * @param {Array} applications - List of application objects
 * @returns {Object} - Stats object with counts for each status
 */
export const calculateStats = (applications = []) => {
  const stats = {
    total: applications.length,
    [JOB_STATUS.APPLIED]: 0,
    [JOB_STATUS.INTERVIEWING]: 0,
    [JOB_STATUS.OFFERED]: 0,
    [JOB_STATUS.REJECTED]: 0,
  };

  applications.forEach((app) => {
    if (app && app.status && stats[app.status] !== undefined) {
      stats[app.status]++;
    }
  });

  return stats;
};

/**
 * Filters applications by status
 * @param {Array} applications 
 * @param {string} status 
 * @returns {Array}
 */
export const filterByStatus = (applications = [], status) => {
  if (!status) return applications;
  return applications.filter((app) => app.status === status);
};
