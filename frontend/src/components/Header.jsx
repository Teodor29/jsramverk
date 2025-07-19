import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

function Header() {
    return (
        <header className="p-4 bg-dark">
            <div className="max-w-7xl m-auto">
                <h1 className="m-0">
                    <Link className="text-text-heading" to="/">
                        SSR Editor
                    </Link>
                </h1>
                <nav className="mt-2">
                    <ul className="flex space-x-4">
                        <li>
                            <Link to="/">Hem</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;
