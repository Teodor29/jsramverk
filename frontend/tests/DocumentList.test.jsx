import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import DocumentList from "../src/components/DocumentList";

test("renders DocumentList component without documents", () => {
    render(
        <Router>
            <DocumentList />
        </Router>
    );
    expect(screen.getByText("Dokument")).toBeInTheDocument();
    expect(screen.getByText("Inga dokument tillgängliga")).toBeInTheDocument();
    
});

test("renders DocumentList component with documents", () => {
    const documents = [
        { _id: "1", title: "Dokument 1" },
        { _id: "2", title: "Dokument 2" },
    ];

    render(
        <Router>
            <DocumentList documents={documents} />
        </Router>
    );
    
    expect(screen.getByText("Dokument")).toBeInTheDocument();
    expect(screen.getByText("Dokument 1")).toBeInTheDocument();
    expect(screen.getByText("Dokument 2")).toBeInTheDocument();
});