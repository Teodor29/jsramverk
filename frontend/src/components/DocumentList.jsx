import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { createDocument } from "../services/document"
import { getDocuments } from "../services/document"

function DocumentList() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  if (loading) {
    return <p>Laddar dokument...</p>
  }

  if (error) {
    return <p>Ett fel uppstod: {error}</p>
  }

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
              <Link to={`/documents/${doc._id}`} className="text-lg">
                {doc.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default DocumentList
