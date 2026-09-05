import { render, screen } from "@testing-library/react"
import { BrowserRouter as Router } from "react-router-dom"
import "@testing-library/jest-dom"
import DocumentList from "../src/components/DocumentList"
import { test, expect, vi } from "vitest"
import { getDocuments } from "../src/services/document"

vi.mock("../src/services/document", () => ({
  getDocuments: vi.fn(),
}))

test("renders DocumentList component without documents", async () => {
  getDocuments.mockResolvedValueOnce([])
  render(
    <Router>
      <DocumentList />
    </Router>,
  )
  expect(
    await screen.findByText("Inga dokument tillgängliga"),
  ).toBeInTheDocument()
})

test("renders DocumentList component with documents", async () => {
  getDocuments.mockResolvedValueOnce([
    { _id: "1", title: "Dokument 1" },
    { _id: "2", title: "Dokument 2" },
  ])

  render(
    <Router>
      <DocumentList />
    </Router>,
  )

  expect(await screen.findByText("Dokument 1")).toBeInTheDocument()
  expect(await screen.findByText("Dokument 2")).toBeInTheDocument()
})
