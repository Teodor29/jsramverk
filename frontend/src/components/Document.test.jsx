import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import Document from "./Document";

test("renders Document component", () => {
    render(
        <Router>
            <Document />
        </Router>
    );
    expect(screen.getByText("Titel")).toBeInTheDocument();
});

test("updates document", async () => {
    render(
        <Router>
            <Document />
        </Router>
    );

    const titleInput = screen.getByLabelText("Titel");
    const contentInput = screen.getByLabelText("Innehåll");
    const submitButton = screen.getByRole("button", { name: "Uppdatera dokument" });

    await userEvent.type(titleInput, "New Title");
    await userEvent.type(contentInput, "New Content");
    await userEvent.click(submitButton);

    expect(titleInput.value).toBe("New Title");
    expect(contentInput.value).toBe("New Content");
});