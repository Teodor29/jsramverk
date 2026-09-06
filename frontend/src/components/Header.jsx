import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Header() {
  const { isAuthenticated, logout } = useAuth()

  return (
    <header className="bg-dark">
      <div className="p-4 container m-auto flex gap-4">
        <h1 className="m-0">
          <Link className="text-text-heading" to="/">
            SSR Editor
          </Link>
        </h1>
        <nav className="flex items-center ml-auto gap-4">
          {isAuthenticated ? (
              <Link onClick={logout}>logga ut</Link>
          ) : (
            <>
              <Link to="/login">Logga in</Link>
              <Link to="/register">Registrera</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
