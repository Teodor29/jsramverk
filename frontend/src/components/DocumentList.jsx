import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
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

  if (loading) {
    return <p>Laddar dokument...</p>
  }

  if (error) {
    return <p>Ett fel uppstod: {error}</p>
  }

  if (!documents || documents.length === 0) {
    return <p>Inga dokument tillgängliga</p>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Dokument</h2>
      <ul className="space-y-2">
        {documents.map((doc) => (
          <li key={doc._id}>
            <Link to={`/documents/${doc._id}`} className="text-lg">
              {doc.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default DocumentList
