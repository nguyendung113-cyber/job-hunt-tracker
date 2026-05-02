import { useAuthContext } from "../contexts/AuthContext";

/**
 * Custom hook for authentication management
 * Now uses global AuthContext
 */
export const useAuth = () => {
  return useAuthContext();
};

export default useAuth;
