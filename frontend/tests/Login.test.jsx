import { render, screen } from "@testing-library/react"
import { BrowserRouter as Router } from "react-router-dom"
import "@testing-library/jest-dom"
import Login from "../src/components/Login"
import { test, expect, vi } from "vitest"

const auth = vi.hoisted(() => ({
  isAuthenticated: false,
  loading: false,
  login: vi.fn(),
}))

vi.mock("../src/context/AuthContext", () => ({
  useAuth: () => auth,
}))

test("renders Login component", () => {
  sessionStorage.clear()
  render(
    <Router>
      <Login />
    </Router>,
  )
  expect(screen.getByRole("heading", { name: "Logga in" })).toBeInTheDocument()
})

test("shows loading state", () => {
  auth.loading = true
  render(
    <Router>
      <Login />
    </Router>,
  )
  expect(screen.getByText("Laddar...")).toBeInTheDocument()
  auth.loading = false
})
