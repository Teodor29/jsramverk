import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import Login from "../src/components/Login";
import { test, expect } from "vitest";

const apiUrl = "http://example.com/api";

test("renders Login component", () => {
    sessionStorage.clear();
    render(
        <Router>
            <Login apiUrl={apiUrl} />
        </Router>
    );
    expect(screen.getByRole("heading", { name: "Logga in" })).toBeInTheDocument();
});

test("updates form inputs", async () => {
    sessionStorage.clear();
    render(
        <Router>
            <Login apiUrl={apiUrl} />
        </Router>
    );

    const emailInput = screen.getByLabelText("E-post");
    const passwordInput = screen.getByLabelText("Lösenord");

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
});
