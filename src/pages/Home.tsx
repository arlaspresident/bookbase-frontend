import { useState } from "react";
import { Link } from "react-router-dom";
import { sökBöcker } from "../api/googleBooks";
import type { GoogleBooksVolume } from "../types/googleBooks";
import "./Home.css";

const Home = () => {
  const [sökterm, setSökterm] = useState("");
  const [språk, setSpråk] = useState("");
  const [ämne, setÄmne] = useState("");
  const [böcker, setBöcker] = useState<GoogleBooksVolume[]>([]);
  const [laddar, setLaddar] = useState(false);
  const [fel, setFel] = useState<string | null>(null);

  /*hanterar sökning med valfria filter*/
  const hanteraSök = async () => {
    try {
      setFel(null);
      setLaddar(true);
      const filter = { språk: språk || undefined, ämne: ämne || undefined };
      const resultat = await sökBöcker(sökterm, filter);
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

        <div className="search-filters">
          <select
            value={ämne}
            onChange={(e) => setÄmne(e.target.value)}
            aria-label="Genre"
          >
            <option value="">Alla genrer</option>
            <option value="fiction">Skönlitteratur</option>
            <option value="nonfiction">Facklitteratur</option>
            <option value="science+fiction">Science fiction</option>
            <option value="fantasy">Fantasy</option>
            <option value="mystery">Deckare</option>
            <option value="biography">Biografi</option>
            <option value="history">Historia</option>
            <option value="children">Barnböcker</option>
          </select>

          <select
            value={språk}
            onChange={(e) => setSpråk(e.target.value)}
            aria-label="Språk"
          >
            <option value="">Alla språk</option>
            <option value="sv">Svenska</option>
            <option value="en">Engelska</option>
            <option value="de">Tyska</option>
            <option value="fr">Franska</option>
            <option value="es">Spanska</option>
          </select>
        </div>

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
