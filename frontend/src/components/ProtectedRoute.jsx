import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const isLoggedIn = sessionStorage.getItem("loggedIn");
    const token = sessionStorage.getItem("token");

    if (!isLoggedIn || !token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
