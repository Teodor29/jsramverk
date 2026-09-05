import { Navigate, Outlet } from "react-router-dom"

function ProtectedRoute({ children }) {
  const isLoggedIn = sessionStorage.getItem("loggedIn")
  const token = sessionStorage.getItem("token")

  if (!isLoggedIn || !token) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
