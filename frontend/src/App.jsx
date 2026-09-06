import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import Document from "./components/Document"
import DocumentList from "./components/DocumentList"
import Login from "./components/Login"
import Register from "./components/Register"
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./context/AuthContext"

function App() {
  let basename = "/~teli21/editor/"
  if (import.meta.env.MODE === "test") {
    basename = "/"
  }

  return (
    <Router basename={basename}>
      <AuthProvider>
        <div className="font-display min-h-screen bg-dark2 text-text-primary flex flex-col">
          <Header />
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
      </AuthProvider>
    </Router>
  )
}

export default App
