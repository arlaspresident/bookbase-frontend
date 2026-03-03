import { Link } from "react-router-dom";
import "./Navbar.css";

/*navbar*/
const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-logo">
          BookBase
        </Link>

        <ul className="navbar-links">
          <li>
            <Link to="/">Sök böcker</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
