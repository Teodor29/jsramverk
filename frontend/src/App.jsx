import { useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import Document from "./components/Document"
import DocumentList from "./components/DocumentList"
import Login from "./components/Login"
import Register from "./components/Register"
import ProtectedRoute from "./components/ProtectedRoute"
import { verifyToken } from "./services/auth"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("loggedIn") === "true",
  )

  let basename = "/~teli21/editor/"
  if (import.meta.env.MODE === "test") {
    basename = "/"
  }

  useEffect(() => {
    const token = sessionStorage.getItem("token")
    const checkToken = async () => {
      try {
        await verifyToken()
      } catch (error) {
        sessionStorage.clear()
        setIsLoggedIn(false)
        console.error("Error verifying token:", error)
      }
    }

    if (token) {
      checkToken()
    }
  }, [])

  return (
    <Router basename={basename}>
      <div className="font-display min-h-screen bg-dark2 text-text-primary flex flex-col">
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <main className="flex-1 container mx-auto p-0">
          <div className="h-full py-8 px-4">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<DocumentList />} />
                <Route path="/documents/:id" element={<Document />} />
              </Route>
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  )
}

export default App
