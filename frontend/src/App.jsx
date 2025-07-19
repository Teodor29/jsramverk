import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Document from "./components/Document";
import DocumentList from "./components/DocumentList";
import Footer from "./components/Footer";

function App() {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL)
            .then((res) => res.json())
            .then((data) => setDocuments(data));
    }, []);

    return (
        <Router basename="/~teli21/editor/">
            <div className="font-display min-h-screen bg-dark2 text-text-primary flex flex-col">
                <Header />
                <main className="flex-1 container mx-auto py-8 px-4">
                    <Routes>
                        <Route
                            path="/"
                            element={<DocumentList documents={documents} />}
                        />
                        <Route path="/documents/:id" element={<Document />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
