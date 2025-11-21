import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import Register from "../src/components/Register";
import { test, expect } from "vitest";

const apiUrl = "http://example.com/api";

test("renders Register component", () => {
    sessionStorage.clear();
    render(
        <Router>
            <Register apiUrl={apiUrl} />
        </Router>
    );
    expect(screen.getByRole("heading", { name: "Registrera dig" })).toBeInTheDocument();
});

test("updates form inputs", async () => {
    sessionStorage.clear();
    render(
        <Router>
            <Register apiUrl={apiUrl} />
        </Router>
    );

    const emailInput = screen.getByLabelText("E-post");
    const passwordInput = screen.getByLabelText("Lösenord");

    await userEvent.type(emailInput, "test@gmail.com");
    await userEvent.type(passwordInput, "test123");

    expect(emailInput.value).toBe("test@gmail.com");
    expect(passwordInput.value).toBe("test123");
});
