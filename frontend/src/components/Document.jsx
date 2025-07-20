import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Document() {
    const { id } = useParams();
    const [document, setDocument] = useState({ title: "", content: "" });
    const apiUrl =
        `${import.meta.env.VITE_API_URL}/${id}` ||
        `https://jsramverk-editor-teli21-g8dfgkbabgfygce2.swedencentral-01.azurewebsites.net/api/${id}`;

    useEffect(() => {
        fetch(apiUrl)
            .then((res) => res.json())
            .then((data) => setDocument(data))
            .catch((err) => console.error(err));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDocument({ ...document, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(document),
                }
            );
            if (!response.ok) {
                console.error("Failed to update document");
                return;
            }

            window.location.href = "/";
        } catch (error) {
            console.error("Failed to update document", error);
            return;
        }
    };

    if (!document) return <p>Loading...</p>;

    return (
        <div className="max-w-xl mx-auto mt-8 dark:bg-dark3 rounded-xl shadow p-6 space-y-6">
            <h2 className="text-center">Redigera dokument</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title">Titel</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={document.title || ""}
                        onChange={handleChange}
                        className="bg-dark4"
                        placeholder="Titel på dokumentet"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="content">Innehåll</label>
                    <textarea
                        id="content"
                        name="content"
                        value={document.content || ""}
                        onChange={handleChange}
                        rows={8}
                        className="bg-dark4"
                        placeholder="Skriv innehållet här"
                        required
                    />
                </div>

                <button type="submit" className="w-full">
                    Uppdatera dokument
                </button>
            </form>
        </div>
    );
}

export default Document;
