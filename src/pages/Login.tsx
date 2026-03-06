import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const { loggaIn, inloggad } = useAuth();
  const navigate = useNavigate();

  if (inloggad) return <Navigate to="/" replace />;

  const [epost, setEpost] = useState("");
  const [lösenord, setLösenord] = useState("");
  const [fel, setFel] = useState<string | null>(null);
  const [laddar, setLaddar] = useState(false);

  const hanteraSubmit = async () => {
    setFel(null);
    setLaddar(true);

    try {
      await loggaIn(epost, lösenord);
      navigate("/");
    } catch (err) {
      setFel(err instanceof Error ? err.message : "Inloggning misslyckades.");
    } finally {
      setLaddar(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-heading">Logga in</h1>

        <form onSubmit={(e) => { e.preventDefault(); void hanteraSubmit(); }} className="auth-form">
          <div className="auth-field">
            <label htmlFor="epost">E-post</label>
            <input
              id="epost"
              type="email"
              value={epost}
              onChange={(e) => setEpost(e.target.value)}
              placeholder="din@epost.se"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="lösenord">Lösenord</label>
            <input
              id="lösenord"
              type="password"
              value={lösenord}
              onChange={(e) => setLösenord(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {fel && <p className="error-message">{fel}</p>}

          <button type="submit" disabled={laddar}>
            {laddar ? "Loggar in..." : "Logga in"}
          </button>
        </form>

        <p className="auth-switch">
          Inget konto? <Link to="/registrera">Skapa konto</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
