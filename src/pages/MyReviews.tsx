import { useEffect, useState } from "react";
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
            <div className="my-review-header">
              <h2 className="my-review-book-title">{r.bokTitel}</h2>
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
                >
                  {[1, 2, 3, 4, 5].map((b) => (
                    <option key={b} value={b}>{b} / 5</option>
                  ))}
                </select>
                <textarea
                  value={redigeraText}
                  onChange={(e) => setRedigeraText(e.target.value)}
                  rows={4}
                />
                <div className="my-review-actions">
                  <button onClick={() => void sparaRedigering(r.id)}>Spara</button>
                  <button className="btn-secondary" onClick={() => setRedigerar(null)}>Avbryt</button>
                </div>
              </div>
            ) : (
              /*visningsläge*/
              <div>
                <p className="my-review-rating">Betyg: {r.betyg} / 5</p>
                <p className="my-review-text">{r.text}</p>
                <div className="my-review-actions">
                  <button onClick={() => startaRedigering(r)}>Redigera</button>
                  <button className="btn-danger" onClick={() => void taBort(r.id)}>Ta bort</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyReviews;
