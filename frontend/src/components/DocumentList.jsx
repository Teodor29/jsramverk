import { Link } from "react-router-dom";

function DocumentList({ documents }) {
    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Dokument</h2>
            {!documents || documents.length === 0 ? (
                <p>Inga dokument tillgängliga</p>
            ) : (
                <ul className="space-y-2">
                    {documents.map((doc) => (
                        <li key={doc._id}>
                            <Link to={`/documents/${doc._id}`} className="text-lg">
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
