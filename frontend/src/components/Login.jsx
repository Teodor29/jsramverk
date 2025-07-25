import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login({ apiUrl }) {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    if (sessionStorage.getItem("loggedIn")) {
        navigate("/");
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            const response = await fetch(`${apiUrl}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: e.target.email.value,
                    password: e.target.password.value,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Login failed");
            }

            console.log("Login successful:", data);

            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("loggedIn", true);
            sessionStorage.setItem("user", JSON.stringify(data.user));

            navigate("/");
            window.location.reload();

        } catch (error) {
            setError(error.message);
            console.error("Failed to login", error);
            return;
        }
    };

    return (
        <div className="card max-w-md">
            <h2 className="text-center">Logga in</h2>
            {error && <p className="text-red-500 text-center m-0">{error}</p>}
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">E-post</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="E-post"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Lösenord</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Lösenord"
                        required
                    />
                </div>
                <button type="submit" className="w-full">
                    Logga in
                </button>
            </form>
            <p className="text-center text-sm">
                Har du inget konto?{" "}
                <Link to="/register">Registrera dig här</Link>
            </p>
        </div>
    );
}

export default Login;
