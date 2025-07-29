import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Document({ apiUrl }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [document, setDocument] = useState({ title: "", content: "" });
    const [shareEmail, setShareEmail] = useState("");

    useEffect(() => {
        async function fetchDocument() {
            try {
                const token = sessionStorage.getItem("token");
                const response = await fetch(`${apiUrl}/docs/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    console.error("Failed to fetch document");
                    return;
                }
                const data = await response.json();
                setDocument(data);
            } catch (error) {
                console.error("Failed to fetch document", error);
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
            const token = sessionStorage.getItem("token");
            const response = await fetch(`${apiUrl}/docs/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
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

    const handleShare = async () => {
        console.log("Dela dokumentet med:", shareEmail);
        try {
            const token = sessionStorage.getItem("token");
            const response = await fetch(`${apiUrl}/docs/share/${id}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: shareEmail }),
            });
            if (!response.ok) {
                console.error("Failed to share document");
                return;
            }
            console.log("Document shared successfully");
        } catch (error) {
            console.error("Failed to share document", error);
        }
    };

    if (!document) return <p>Loading...</p>;

    return (
        <div className="document">
            <form className="h-full flex flex-col" onSubmit={handleSubmit}>
                <div className="flex gap-4 mb-4 sm:flex-row flex-col">
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={document.title || ""}
                        onChange={handleChange}
                        placeholder="Titel på dokumentet"
                        required
                        className="flex-1"
                    />
                    <button type="submit">Uppdatera dokument</button>
                </div>
                <div className="flex gap-4 mb-4 sm:flex-row flex-col">
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={shareEmail}
                        onChange={(e) => setShareEmail(e.target.value)}
                        placeholder="Dela med e-post"
                        required
                        className="flex-1 m-0"
                    />
                    <button type="button" onClick={handleShare}>
                        Dela dokument
                    </button>
                </div>

                <div className="flex-1 min-h-0">
                    <textarea
                        id="content"
                        name="content"
                        className="min-h-[calc(100vh-13rem)]"
                        value={document.content || ""}
                        onChange={handleChange}
                        placeholder="Skriv innehållet här"
                    />
                </div>
            </form>
        </div>
    );
}

export default Document;
