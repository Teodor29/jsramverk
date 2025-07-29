import { Link } from "react-router-dom";

function DocumentList({ documents, apiUrl }) {

    console.log("DocumentList documents:", documents);

    const handleCreateDocument = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await fetch(`${apiUrl}/docs`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: "Untitled Document",
                    content: "",
                }),
            });
            if (!response.ok) {
                console.error("Failed to create document");
                return;
            }
            window.location.reload();
        } catch (error) {
            console.error("Failed to create document", error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <button className="mb-4" onClick={handleCreateDocument}>
                Skapa dokument
            </button>
            <h2 className="text-2xl font-bold mb-4">Dokument</h2>
            {!documents || documents.length === 0 ? (
                <p>Inga dokument tillgängliga</p>
            ) : (
                <ul className="space-y-2">
                    {documents.map((doc) => (
                        <li key={doc._id}>
                            <Link
                                to={`/documents/${doc._id}`}
                                className="text-lg"
                            >
                                {doc.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default DocumentList;
