import { render, screen } from "@testing-library/react"
import { BrowserRouter as Router } from "react-router-dom"
import "@testing-library/jest-dom"
import Header from "../src/components/Header"
import { test, expect, vi } from "vitest"

const auth = vi.hoisted(() => ({
  isAuthenticated: false,
  logout: vi.fn(),
}))

vi.mock("../src/context/AuthContext", () => ({
  useAuth: () => auth,
}))

test("renders Header component", () => {
  render(
    <Router>
      <Header />
    </Router>,
  )
  expect(screen.getByText("SSR Editor")).toBeInTheDocument()
  expect(screen.getByText("Logga in")).toBeInTheDocument()
})
