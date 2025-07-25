import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Document({ apiUrl }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [document, setDocument] = useState({ title: "", content: "" });

    useEffect(() => {
        async function fetchDocument() {
            try {
                const response = await fetch(`${apiUrl}/docs/${id}`);
                const data = await response.json();
                setDocument(data);
            } catch (err) {
                console.error(err);
            }
        }

        fetchDocument();
    }, [id, apiUrl]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDocument({ ...document, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiUrl}/docs/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(document),
            });
            if (!response.ok) {
                console.error("Failed to update document");
                return;
            }

            navigate("/");
            window.location.reload();
        } catch (error) {
            console.error("Failed to update document", error);
            return;
        }
    };

    if (!document) return <p>Loading...</p>;

    return (
        <div className="card">
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
