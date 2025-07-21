import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="p-4 text-center bg-dark">
            <ul className="flex space-x-4 justify-center">
                <li>
                    <Link
                        onClick={() =>
                            window.open("/~teli21/editor/coverage/index.html", "_blank")
                        }
                    >
                        Coverage
                    </Link>
                </li>
            </ul>
        </footer>
    );
}

export default Footer;
