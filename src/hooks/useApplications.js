import { useApplicationsContext } from "../contexts/ApplicationsContext";

/**
 * Custom hook for Applications CRUD with Real-time subscription
 * Refactored to use ApplicationsContext
 */
export const useApplications = () => {
  return useApplicationsContext();
};

export default useApplications;
