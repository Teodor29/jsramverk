import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { createDocument, deleteDocument } from "../services/document"
import { getDocuments } from "../services/document"
import { Trash } from "lucide-react"

function DocumentList() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const data = await getDocuments()
        setDocuments(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  const handleCreateDocument = async () => {
    try {
      await createDocument({
        title: "Untitled Document",
        content: "",
      })
      window.location.reload()
    } catch (error) {
      console.error("Failed to create document", error)
    }
  }

  const handleDeleteDocument = async (id) => {
    try {
      await deleteDocument(id)
      window.location.reload()
    } catch (error) {
      console.error("Failed deleting document", error)
    }
  }

  if (loading) {
    return <p className="text-center">Laddar dokument...</p>
  }

  if (error) {
    return <p className="text-center text-danger">Ett fel uppstod: {error}</p>
  }

  return (
    <div className="flex flex-col max-w-2xl w-full mx-auto">
      <button className="ml-auto mb-4" onClick={handleCreateDocument}>
        Skapa dokument
      </button>
      {!documents || documents.length === 0 ? (
        <p className="text-center">Inga dokument tillgängliga</p>
      ) : (
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li
              key={doc._id}
              onClick={() => navigate(`/documents/${doc._id}`)}
              className="doc-card"
            >
              <span>{doc.title}</span>

              <span className="ml-auto">
                {new Date(doc.updated_at).toLocaleDateString("sv-SE")}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteDocument(doc._id)
                }}
                className="p-2 ml-2"
                aria-label={`Ta bort ${doc.title}`}
              >
                <Trash size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default DocumentList
