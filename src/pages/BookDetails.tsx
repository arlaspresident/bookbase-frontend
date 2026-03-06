import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { hämtaBok } from "../api/googleBooks";
import { hämtaRecensioner, skapaRecension } from "../api/reviews";
import type { GoogleBooksVolume } from "../types/googleBooks";
import type { Recension } from "../api/reviews";
import { useAuth } from "../context/AuthContext";
import "./BookDetails.css";

const BookDetails = () => {
  const { id } = useParams();
  const { inloggad } = useAuth();

  const [bok, setBok] = useState<GoogleBooksVolume | null>(null);
  const [laddar, setLaddar] = useState(true);
  const [fel, setFel] = useState<string | null>(null);

  const [recensioner, setRecensioner] = useState<Recension[]>([]);
  const [nyText, setNyText] = useState("");
  const [nyBetyg, setNyBetyg] = useState(5);
  const [sparar, setSparar] = useState(false);
  const [recensionFel, setRecensionFel] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const hämta = async () => {
      try {
        setFel(null);
        setLaddar(true);
        const [bokData, recensionsData] = await Promise.all([
          hämtaBok(id),
          hämtaRecensioner(id),
        ]);
        setBok(bokData);
        setRecensioner(recensionsData);
      } catch (err) {
        setFel(err instanceof Error ? err.message : "Ett okänt fel inträffade.");
      } finally {
        setLaddar(false);
      }
    };

    hämta();
  }, [id]);

  const skickaRecension = async () => {
    if (!id || !bok) return;
    setSparar(true);
    setRecensionFel(null);

    try {
      const titel = bok.volumeInfo.title ?? "Okänd titel";
      const ny = await skapaRecension(id, titel, nyText, nyBetyg);
      setRecensioner((prev) => [ny, ...prev]);
      setNyText("");
      setNyBetyg(5);
    } catch (err) {
      setRecensionFel(err instanceof Error ? err.message : "Kunde inte spara recensionen.");
    } finally {
      setSparar(false);
    }
  };

  if (laddar) return <p className="loading-text">Laddar bokdetaljer...</p>;
  if (fel) return <p className="error-message">{fel}</p>;
  if (!bok) return <p>Ingen bok hittades.</p>;

  const info = bok.volumeInfo;
  const titel = info.title ?? "Okänd titel";
  const författare = info.authors?.join(", ") ?? "Okänd författare";
  const datum = info.publishedDate ?? "Okänt datum";
  const beskrivning = info.description ?? "Ingen beskrivning tillgänglig.";
  const bild = info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail;

  return (
    <div>
      <Link to="/" className="book-detail-back">
        ← Tillbaka
      </Link>

      <div className="book-detail-layout">
        {bild && (
          <img src={bild} alt={`Omslag: ${titel}`} className="book-detail-cover" />
        )}

        <div className="book-detail-info">
          <h1 className="book-detail-title">{titel}</h1>
          <p className="book-detail-meta"><strong>Författare:</strong> {författare}</p>
          <p className="book-detail-meta"><strong>Publicerad:</strong> {datum}</p>

          <div
            className="book-detail-description"
            dangerouslySetInnerHTML={{ __html: beskrivning }}
          />
        </div>
      </div>

      {/*recensioner*/}
      <section className="reviews-section">
        <h2 className="reviews-heading">
          Recensioner ({recensioner.length})
        </h2>

        {/*formulär visas ba om inloggad*/}
        {inloggad && (
          <div className="review-form">
            <h3 className="review-form-heading">Skriv en recension</h3>

            <div className="review-form-row">
              <label htmlFor="betyg">Betyg</label>
              <select
                id="betyg"
                value={nyBetyg}
                onChange={(e) => setNyBetyg(Number(e.target.value))}
                className="review-select"
              >
                {[1, 2, 3, 4, 5].map((b) => (
                  <option key={b} value={b}>{b} / 5</option>
                ))}
              </select>
            </div>

            <textarea
              value={nyText}
              onChange={(e) => setNyText(e.target.value)}
              placeholder="Skriv din recension här..."
              rows={4}
            />

            {recensionFel && <p className="error-message">{recensionFel}</p>}

            <button
              type="button"
              onClick={() => void skickaRecension()}
              disabled={sparar || nyText.trim().length === 0}
            >
              {sparar ? "Sparar..." : "Skicka recension"}
            </button>
          </div>
        )}

        {!inloggad && (
          <p className="reviews-login-prompt">
            <Link to="/logga-in">Logga in</Link> för att skriva en recension.
          </p>
        )}

        {/*recensionslista*/}
        {recensioner.length === 0 ? (
          <p className="empty-text">Inga recensioner än. Bli först!</p>
        ) : (
          <ul className="reviews-list">
            {recensioner.map((r) => (
              <li key={r.id} className="review-card">
                <div className="review-card-header">
                  <span className="review-author">{r.användarnamn}</span>
                  <span className="review-rating">⭐ {r.betyg} / 5</span>
                  <span className="review-date">
                    {new Date(r.skapadDatum).toLocaleDateString("sv-SE")}
                  </span>
                </div>
                <p className="review-text">{r.text}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default BookDetails;
