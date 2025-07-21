import { Link } from "react-router-dom";

function Header() {
    return (
        <header className="p-4 bg-dark">
            <div className="max-w-7xl m-auto">
                <h1 className="m-0">
                    <Link className="text-text-heading" to="/">
                        SSR Editor
                    </Link>
                </h1>
            </div>
        </header>
    );
}

export default Header;
