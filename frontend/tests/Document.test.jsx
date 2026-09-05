import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BrowserRouter as Router } from "react-router-dom"
import "@testing-library/jest-dom"
import Document from "../src/components/Document"
import { test, expect, vi } from "vitest"
import { getDocumentById, updateDocument } from "../src/services/document"

vi.mock("../src/services/document", () => ({
  getDocumentById: vi.fn(),
  updateDocument: vi.fn(),
}))

test("renders Document component", async () => {
  getDocumentById.mockResolvedValueOnce({ title: "", content: "" })
  render(
    <Router>
      <Document />
    </Router>,
  )
  expect(await screen.findByText("Titel")).toBeInTheDocument()
})

test("updates document", async () => {
  getDocumentById.mockResolvedValueOnce({ title: "", content: "" })
  updateDocument.mockResolvedValueOnce({})
  render(
    <Router>
      <Document />
    </Router>,
  )

  const titleInput = await screen.findByLabelText("Titel")
  const contentInput = await screen.findByLabelText("Innehåll")
  const submitButton = screen.getByRole("button", {
    name: "Uppdatera dokument",
  })

  await userEvent.type(titleInput, "New Title")
  await userEvent.type(contentInput, "New Content")
  await userEvent.click(submitButton)

  expect(titleInput.value).toBe("New Title")
  expect(contentInput.value).toBe("New Content")
})
