import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  const initAuth = useAuthStore(s => s.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
