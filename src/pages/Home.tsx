import { useState } from "react";
import { Link } from "react-router-dom";
import { sökBöcker } from "../api/googleBooks";
import type { GoogleBooksVolume } from "../types/googleBooks";
import "./Home.css";

const Home = () => {
  const [sökterm, setSökterm] = useState("");
  const [böcker, setBöcker] = useState<GoogleBooksVolume[]>([]);
  const [laddar, setLaddar] = useState(false);
  const [fel, setFel] = useState<string | null>(null);

  /*hanterar sökning*/
  const hanteraSök = async () => {
    try {
      setFel(null);
      setLaddar(true);
      const resultat = await sökBöcker(sökterm);
      setBöcker(resultat);
    } catch (err) {
      setFel(err instanceof Error ? err.message : "Ett okänt fel inträffade.");
      setBöcker([]);
    } finally {
      setLaddar(false);
    }
  };

  return (
    <div>
      <h1 className="home-heading">Hitta din nästa bok</h1>

      <form onSubmit={(e) => { e.preventDefault(); void hanteraSök(); }} className="search-form">
        <label className="visually-hidden" htmlFor="sökterm">
          Sök efter böcker
        </label>
        <input
          id="sökterm"
          type="text"
          value={sökterm}
          onChange={(e) => setSökterm(e.target.value)}
          placeholder="Sök på titel, författare, ämne..."
        />
        <button type="submit" disabled={laddar || sökterm.trim().length === 0}>
          Sök
        </button>
      </form>

      {/*statusmeddelanden*/}
      {laddar && <p className="loading-text">Laddar...</p>}
      {fel && <p className="error-message">{fel}</p>}
      {!laddar && !fel && böcker.length === 0 && (
        <p className="empty-text">Skriv något i sökfältet och tryck på sök.</p>
      )}

      {/*sökresultat*/}
      <ul className="book-grid">
        {böcker.map((bok) => {
          const info = bok.volumeInfo;
          const titel = info.title ?? "Okänd titel";
          const författare = info.authors?.join(", ") ?? "Okänd författare";
          const bild = info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail;

          return (
            <li key={bok.id} className="book-card">
              {bild ? (
                <img
                  src={bild}
                  alt={`Omslag: ${titel}`}
                  className="book-cover"
                />
              ) : (
                <div aria-hidden="true" className="book-cover-placeholder" />
              )}

              <div className="book-info">
                <h2 className="book-title">{titel}</h2>
                <p className="book-author">{författare}</p>
                <Link to={`/bok/${bok.id}`}>Visa detaljer</Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Home;
