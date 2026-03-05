import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

/*navbar*/
const Navbar = () => {
  const { inloggad, användare, loggaUt } = useAuth();
  const navigate = useNavigate();

  const hanteraLoggaUt = () => {
    loggaUt();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-logo">
          BookBase
        </Link>

        <ul className="navbar-links">
          {inloggad ? (
            <>
              <li>
                <Link to="/mina-recensioner">Mina recensioner</Link>
              </li>
              <li className="navbar-user">
                Inloggad som {användare?.namn}
              </li>
              <li>
                <button className="navbar-logout" onClick={hanteraLoggaUt}>
                  Logga ut
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/logga-in">Logga in</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
