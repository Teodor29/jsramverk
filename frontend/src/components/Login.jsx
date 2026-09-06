import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"

function Login() {
  const navigate = useNavigate()
  const { isAuthenticated, loading, login } = useAuth()
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
      await login(email, password)

      navigate("/")
    } catch (error) {
      setError("Felaktig e-post eller lösenord")
      return
    }
  }

  return (
    <div className="card max-w-md">
      <h2 className="text-center">Logga in</h2>
      {error && <p className="text-red-500 text-center m-0">{error}</p>}
      <form className="space-y-4" onSubmit={handleSubmit}>
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
          Logga in
        </button>
      </form>
      <p className="text-center text-sm">
        Har du inget konto? <Link to="/register">Registrera dig här</Link>
      </p>
    </div>
  )
}

export default Login
