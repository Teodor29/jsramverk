import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <p className="text-center">Laddar...</p>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
