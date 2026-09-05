import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import App from "../src/App"
import { test, expect } from "vitest"

test("App renderar utan krasch", async () => {
  render(<App />)
  expect(await screen.findByText("SSR Editor")).toBeInTheDocument()
  expect(await screen.findByText("Dokument")).toBeInTheDocument()
})
