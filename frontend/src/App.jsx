import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Document from "./components/Document";
import DocumentList from "./components/DocumentList";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { use } from "react";

function App() {
    const [documents, setDocuments] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(
        sessionStorage.getItem("loggedIn") === "true"
    );

    const apiUrl =
        import.meta.env.VITE_API_URL ||
        "https://jsramverk-editor-teli21-g8dfgkbabgfygce2.swedencentral-01.azurewebsites.net/api";

    let basename = "/~teli21/editor/";
    if (import.meta.env.MODE === "test") {
        basename = "/";
    }

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        const verifyToken = async () => {
            try {
                const response = await fetch(`${apiUrl}/auth/verify`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    sessionStorage.clear();
                    setIsLoggedIn(false);
                    return;
                }
            } catch (error) {
                console.error("Error verifying token:", error);
            }
        };

        if (token) {
            verifyToken();
        }
    }, [apiUrl]);

    useEffect(() => {
        fetch(`${apiUrl}/docs`)
            .then((res) => res.json())
            .then((data) => setDocuments(data));
    }, [apiUrl]);

    return (
        <Router basename={basename}>
            <div className="font-display min-h-screen bg-dark2 text-text-primary flex flex-col">
                <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                <main className="flex-1 container mx-auto py-8 px-4">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <DocumentList documents={documents} />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/documents/:id"
                            element={
                                <ProtectedRoute>
                                    <Document apiUrl={apiUrl} />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/login"
                            element={<Login apiUrl={apiUrl} />}
                        />
                        <Route
                            path="/register"
                            element={<Register apiUrl={apiUrl} />}
                        />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
