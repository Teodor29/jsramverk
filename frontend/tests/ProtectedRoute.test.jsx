import { render, screen } from "@testing-library/react"
import { MemoryRouter as Router, Route, Routes } from "react-router-dom"
import "@testing-library/jest-dom"
import ProtectedRoute from "../src/components/ProtectedRoute"
import { test, expect, vi } from "vitest"

const auth = vi.hoisted(() => ({
  isAuthenticated: false,
  loading: false,
}))

vi.mock("../src/context/AuthContext", () => ({
  useAuth: () => auth,
}))

test("renders ProtectedRoute component", () => {
  auth.isAuthenticated = true
  render(
    <Router>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<p>test</p>} />
        </Route>
      </Routes>
    </Router>,
  )
  expect(screen.getByText("test")).toBeInTheDocument()
})
