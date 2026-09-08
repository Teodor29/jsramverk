import { render, screen } from "@testing-library/react"
import { BrowserRouter as Router } from "react-router-dom"
import "@testing-library/jest-dom"
import Document from "../src/components/Document"
import { test, expect, vi } from "vitest"
import { getDocumentById } from "../src/services/document"

vi.mock("../src/services/document", () => ({
  getDocumentById: vi.fn(),
}))

test("renders Document component", async () => {
  getDocumentById.mockResolvedValueOnce({ title: "Title", content: "" })

  render(
    <Router>
      <Document />
    </Router>,
  )

  expect(await screen.findByDisplayValue("Title")).toBeInTheDocument()
})
