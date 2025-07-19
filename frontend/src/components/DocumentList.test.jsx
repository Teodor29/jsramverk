import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import DocumentList from "./DocumentList";

test("renders DocumentList component", () => {
    render(
        <Router>
            <DocumentList />
        </Router>
    );
    expect(screen.getByText("Dokument")).toBeInTheDocument();
});