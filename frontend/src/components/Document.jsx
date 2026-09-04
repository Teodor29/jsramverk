import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getDocumentById, updateDocument } from "../services/document"

function Document() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [document, setDocument] = useState({ title: "", content: "" })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDocumentById = async () => {
      try {
        const data = await getDocumentById(id)
        setDocument(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDocumentById()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setDocument({ ...document, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await updateDocument(id, document)
      navigate("/")
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <p>Laddar dokument...</p>
  }

  if (error) {
    return <p>Ett fel uppstod: {error}</p>
  }

  if (!document) {
    return <p>Dokumentet hittades inte.</p>
  }

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
  )
}

export default Document
