import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import Document from "./components/Document"
import DocumentList from "./components/DocumentList"
import Footer from "./components/Footer"

function App() {
  let basename = "/~teli21/editor/"
  if (import.meta.env.MODE === "test") {
    basename = "/"
  }
  return (
    <Router basename={basename}>
      <div className="font-display min-h-screen bg-dark2 text-text-primary flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto py-8 px-4">
          <Routes>
            <Route path="/" element={<DocumentList />} />
            <Route path="/documents/:id" element={<Document />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
