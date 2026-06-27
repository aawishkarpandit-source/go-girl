import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuth = localStorage.getItem("gg-admin-auth") === "true";
  if (!isAuth) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
