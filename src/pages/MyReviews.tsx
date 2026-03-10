import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { hämtaMinaRecensioner, taBortRecension, uppdateraRecension } from "../api/reviews";
import type { Recension } from "../api/reviews";
import "./MyReviews.css";

const MyReviews = () => {
  const [recensioner, setRecensioner] = useState<Recension[]>([]);
  const [laddar, setLaddar] = useState(true);
  const [fel, setFel] = useState<string | null>(null);

  /*id för recensionen som redigeras just nu*/
  const [redigerar, setRedigerar] = useState<number | null>(null);
  const [redigeraText, setRedigeraText] = useState("");
  const [redigeraBetyg, setRedigeraBetyg] = useState(5);

  /*id för recensionen som håller på o tas bort (bekräftelse)*/
  const [bekräftar, setBekräftar] = useState<number | null>(null);

  useEffect(() => {
    const hämta = async () => {
      try {
        const data = await hämtaMinaRecensioner();
        setRecensioner(data);
      } catch (err) {
        setFel(err instanceof Error ? err.message : "Något gick fel.");
      } finally {
        setLaddar(false);
      }
    };

    void hämta();
  }, []);

  const startaRedigering = (r: Recension) => {
    setRedigerar(r.id);
    setRedigeraText(r.text);
    setRedigeraBetyg(r.betyg);
  };

  const sparaRedigering = async (id: number) => {
    try {
      const uppdaterad = await uppdateraRecension(id, redigeraText, redigeraBetyg);
      setRecensioner((prev) => prev.map((r) => (r.id === id ? uppdaterad : r)));
      setRedigerar(null);
    } catch (err) {
      setFel(err instanceof Error ? err.message : "Kunde inte spara.");
    }
  };

  const taBort = async (id: number) => {
    try {
      await taBortRecension(id);
      setRecensioner((prev) => prev.filter((r) => r.id !== id));
      setBekräftar(null);
    } catch (err) {
      setFel(err instanceof Error ? err.message : "Kunde inte ta bort.");
    }
  };

  if (laddar) return <p className="loading-text">Laddar recensioner...</p>;

  return (
    <div>
      <h1 className="my-reviews-heading">Mina recensioner</h1>

      {fel && <p className="error-message">{fel}</p>}

      {recensioner.length === 0 && !fel && (
        <p className="empty-text">Du har inte skrivit några recensioner än.</p>
      )}

      <ul className="my-reviews-list">
        {recensioner.map((r) => (
          <li key={r.id} className="my-review-card">
            <div className="my-review-layout">
              <Link to={`/bok/${r.bokId}`} className="my-review-cover-link">
                <img
                  src={`https://books.google.com/books/content?id=${r.bokId}&printsec=frontcover&img=1&zoom=1`}
                  alt={r.bokTitel}
                  className="my-review-cover"
                />
              </Link>

              <div className="my-review-content">
                <div className="my-review-header">
                  <h2 className="my-review-book-title">
                    <Link to={`/bok/${r.bokId}`}>{r.bokTitel}</Link>
                  </h2>
                  <span className="my-review-date">
                    {new Date(r.skapadDatum).toLocaleDateString("sv-SE")}
                  </span>
                </div>

                {redigerar === r.id ? (
                  /*redigeringsläge*/
                  <div className="my-review-edit">
                    <select
                      value={redigeraBetyg}
                      onChange={(e) => setRedigeraBetyg(Number(e.target.value))}
                      className="my-review-select"
                      aria-label="Betyg"
                    >
                      {[1, 2, 3, 4, 5].map((b) => (
                        <option key={b} value={b}>{b} / 5</option>
                      ))}
                    </select>
                    <textarea
                      value={redigeraText}
                      onChange={(e) => setRedigeraText(e.target.value)}
                      rows={4}
                      aria-label="Recensionstext"
                    />
                    <div className="my-review-actions">
                      <button type="button" onClick={() => void sparaRedigering(r.id)}>Spara</button>
                      <button type="button" className="btn-secondary" onClick={() => setRedigerar(null)}>Avbryt</button>
                    </div>
                  </div>
                ) : (
                  /*visningsläge*/
                  <div>
                    <p className="my-review-rating">Betyg: {r.betyg} / 5</p>
                    <p className="my-review-text">{r.text}</p>

                    {bekräftar === r.id ? (
                      /*bekräftelse innan radering*/
                      <div className="my-review-confirm">
                        <span>Är du säker?</span>
                        <button type="button" className="btn-danger" onClick={() => void taBort(r.id)}>Ja, ta bort</button>
                        <button type="button" className="btn-secondary" onClick={() => setBekräftar(null)}>Avbryt</button>
                      </div>
                    ) : (
                      <div className="my-review-actions">
                        <button type="button" onClick={() => startaRedigering(r)}>Redigera</button>
                        <button type="button" className="btn-danger" onClick={() => setBekräftar(r.id)}>Ta bort</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyReviews;
