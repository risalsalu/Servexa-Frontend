import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

export default function useAuth() {
  const loadSession = useAuthStore(s => s.loadSession);

  useEffect(() => {
    loadSession();
  }, []);
}
