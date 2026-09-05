import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { io } from "socket.io-client"
import {
  getDocumentById,
  shareDocument,
  updateDocument,
} from "../services/document"

function Document() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [document, setDocument] = useState({ title: "", content: "" })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [shareEmail, setShareEmail] = useState("")
  const [receivedFromSocket, setReceivedFromSocket] = useState(false)
  const socketRef = useRef(null)
  const socketURL =
    import.meta.env.VITE_BACKEND_URL ||
    "https://jsramverk-editor-teli21-g8dfgkbabgfygce2.swedencentral-01.azurewebsites.net"

  console.log("Using socket URL:", socketURL)

  useEffect(() => {
    socketRef.current = io(socketURL)

    socketRef.current.on("connect", () => {
      console.log("Connected to socket server")
      if (id) {
        socketRef.current.emit("create", id)
        console.log("Joining room:", id)
      }
    })

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from socket server")
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [id])

  useEffect(() => {
    let timeout

    async function fetchDocument() {
      try {
        setLoading(true)
        setDocument(await getDocumentById(id))
      } catch (error) {
        console.error("Failed to fetch document", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (socketRef.current) {
      socketRef.current.on("documentUpdated", (updatedDoc) => {
        if (updatedDoc._id === id) {
          setDocument(updatedDoc)
          setReceivedFromSocket(true)
          clearTimeout(timeout)
        }
      })

      timeout = setTimeout(() => {
        if (!receivedFromSocket) {
          fetchDocument()
        }
      }, 500)
    } else {
      fetchDocument()
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("documentUpdated")
      }
      clearTimeout(timeout)
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    const updatedDoc = { ...document, [name]: value }
    setDocument(updatedDoc)

    if (socketRef.current) {
      socketRef.current.emit("update", updatedDoc)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateDocument(id, document)
      navigate("/")
      window.location.reload()
    } catch (error) {
      console.error("Failed to update document", error)
      return
    }
  }

  const handleShare = async () => {
    console.log("Dela dokumentet med:", shareEmail)
    try {
      await shareDocument(id, shareEmail)
      console.log("Document shared successfully")
    } catch (error) {
      console.error("Failed to share document", error)
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
    <div className="document">
      <div className="flex gap-4 mb-4 sm:flex-row flex-col">
        <input
          type="text"
          id="email"
          name="email"
          value={shareEmail}
          onChange={(e) => setShareEmail(e.target.value)}
          placeholder="Dela med e-post"
          className="flex-1 m-0"
        />
        <button type="button" onClick={handleShare}>
          Dela dokument
        </button>
      </div>
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
  )
}

export default Document
