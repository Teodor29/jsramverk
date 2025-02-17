import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function Header() {
    return (
      <div className="header">
        <h1>
          <Link to="/">SSR Editor</Link>
        </h1>
      </div>
    );
  }
  
  export default Header;