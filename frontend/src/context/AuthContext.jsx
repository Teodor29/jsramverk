import { createContext, useContext, useEffect, useState } from "react"
import { getUser, login as loginService } from "../services/auth"
import { getToken, removeToken, setToken } from "../services/token"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      const token = getToken()
      console.log("Checking auth, token:", token)
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const user = await getUser()
        setUser(user)
      } catch (error) {
        console.error("Failed to fetch user:", error)
        removeToken()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const login = async (email, password) => {
    const data = await loginService(email, password)
    setToken(data.token)
    setUser(data.user)
  }

  const logout = () => {
    removeToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
