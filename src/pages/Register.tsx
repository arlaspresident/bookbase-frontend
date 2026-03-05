import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const Register = () => {
  const { registrera } = useAuth();
  const navigate = useNavigate();

  const [namn, setNamn] = useState("");
  const [epost, setEpost] = useState("");
  const [lösenord, setLösenord] = useState("");
  const [fel, setFel] = useState<string | null>(null);
  const [laddar, setLaddar] = useState(false);

  const hanteraSubmit = async () => {
    setFel(null);
    setLaddar(true);

    try {
      await registrera(namn, epost, lösenord);
      navigate("/");
    } catch (err) {
      setFel(err instanceof Error ? err.message : "Registrering misslyckades.");
    } finally {
      setLaddar(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-heading">Skapa konto</h1>

        <form onSubmit={(e) => { e.preventDefault(); void hanteraSubmit(); }} className="auth-form">
          <div className="auth-field">
            <label htmlFor="namn">Namn</label>
            <input
              id="namn"
              type="text"
              value={namn}
              onChange={(e) => setNamn(e.target.value)}
              placeholder="Ditt namn"
              required
            />
          </div>

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
            {laddar ? "Skapar konto..." : "Skapa konto"}
          </button>
        </form>

        <p className="auth-switch">
          Har du redan ett konto? <Link to="/logga-in">Logga in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
