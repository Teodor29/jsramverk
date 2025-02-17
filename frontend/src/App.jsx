import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './styles/main.scss';
import Header from './components/Header';
import Document from './components/Document';


function App() {
    const [documents, setDocuments] = useState([]);
    console.log(documents);
    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL)
            .then(res => res.json())
            .then(data => setDocuments(data));
    }, []);

    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={
                    <div class="main">
                        <h1>Document List</h1>
                        <ul>
                            {documents.map(doc => (
                                <h3 key={doc._id}>
                                    <Link to={`/documents/${doc._id}`}>{doc.title}</Link>
                                </h3>
                            ))}
                        </ul>
                    </div>
                } />

                {/* Route for the document details view */}
                <Route path="/documents/:id" element={<Document />} />
            </Routes>
        </Router>
    );
}
export default App;
