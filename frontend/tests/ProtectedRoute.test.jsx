import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import ProtectedRoute from "../src/components/ProtectedRoute";
import { test, expect } from "vitest";

function TestPage() {
    return <div>Secure Page</div>;
}

test("renders ProtectedRoute component when authenticated", () => {
    sessionStorage.setItem("loggedIn", "true");
    sessionStorage.setItem("token", "token123");
    render(
        <Router>
            <ProtectedRoute>
                <TestPage />
            </ProtectedRoute>
        </Router>
    );
    expect(screen.getByText("Secure Page")).toBeInTheDocument();
});

test("redirects when not authenticated", () => {
    sessionStorage.clear();
    render(
        <Router>
            <ProtectedRoute>
                <TestPage />
            </ProtectedRoute>
        </Router>
    );
    expect(screen.queryByText("Secure Page")).not.toBeInTheDocument();
});
