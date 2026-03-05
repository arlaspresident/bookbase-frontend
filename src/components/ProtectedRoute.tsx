import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

/*skickar ej inloggade användare till inloggningssidan*/
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { inloggad } = useAuth();

  if (!inloggad) {
    return <Navigate to="/logga-in" replace />;
  }

  return children;
};

export default ProtectedRoute;
