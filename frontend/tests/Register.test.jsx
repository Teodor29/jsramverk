import { render, screen } from "@testing-library/react"
import { BrowserRouter as Router } from "react-router-dom"
import "@testing-library/jest-dom"
import Register from "../src/components/Register"
import { test, expect, vi } from "vitest"

const auth = vi.hoisted(() => ({
  isAuthenticated: false,
  loading: false,
}))

vi.mock("../src/context/AuthContext", () => ({
  useAuth: () => auth,
}))

test("renders Register component", () => {
  sessionStorage.clear()
  render(
    <Router>
      <Register />
    </Router>,
  )
  expect(
    screen.getByRole("heading", { name: "Registrera dig" }),
  ).toBeInTheDocument()
})

test("shows loading state", () => {
  auth.loading = true
  render(
    <Router>
      <Register />
    </Router>,
  )
  expect(screen.getByText("Laddar...")).toBeInTheDocument()
})
