import { Link } from "react-router-dom";

function Header({ isLoggedIn, setIsLoggedIn }) {
    return (
        <header className="p-4 bg-dark">
            <div className="max-w-7xl m-auto flex gap-4">
                <h1 className="m-0">
                    <Link className="text-text-heading" to="/">
                        SSR Editor
                    </Link>
                </h1>
                <nav className="flex items-center ml-auto gap-4">
                    {isLoggedIn ? (
                        <>
                            <a
                                onClick={() => {
                                    sessionStorage.clear();
                                    setIsLoggedIn(false);
                                    window.location.reload();
                                }}
                            >
                                Logga ut
                            </a>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                Logga in
                            </Link>
                            <Link to="/register">
                                Registrera
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;
