import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { register } from "../services/auth"

function Register() {
  const navigate = useNavigate()
  const { isAuthenticated, loading } = useAuth()
  const [error, setError] = useState(null)

  if (loading) {
    return <p>Laddar...</p>
  }

  if (isAuthenticated) {
    navigate("/")
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError(null)
      const email = e.target.email.value
      const password = e.target.password.value
      const data = await register(email, password)

      console.log("Registration successful:", data)

      navigate("/")
    } catch (error) {
      setError(error.message)
      console.error("Failed to register", error)
      return
    }
  }

  return (
    <div className="card max-w-md">
      <h2 className="text-center">Registrera dig</h2>
      {error && <p className="text-red-500 text-center m-0">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">E-post</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="E-post"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Lösenord</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Lösenord"
            required
          />
        </div>
        <button type="submit" className="w-full">
          Registrera
        </button>
      </form>
      <p className="text-center text-sm">
        Har du redan ett konto? <Link to="/login">Logga in här</Link>
      </p>
    </div>
  )
}

export default Register
