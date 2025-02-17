import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Document() {
    const { id } = useParams();
    const [document, setDocument] = useState({ title: '', content: '' });

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/${id}`)
            .then(res => res.json())
            .then(data => setDocument(data))
            .catch(err => console.error(err));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDocument({ ...document, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`${import.meta.env.VITE_API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(document),
        });

        if (!response.ok) {
            console.error('Failed to update document');
        }
    };

    if (!document) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="form">
                <h1>{document.title}</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="title">Titel</label>
                    <input type="text"
                        name="title"
                        value={document.title}
                        onChange={handleChange}
                    />

                    <label htmlFor="content" className="form-label">Innehåll</label>
                    <textarea
                        name="content"
                        value={document.content}
                        onChange={handleChange}
                    />

                    <button type="submit">Uppdatera</button>
                </form>
            </div>
        </>
    );
}

export default Document;
