import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { hämtaBok } from "../api/googleBooks";
import type { GoogleBooksVolume } from "../types/googleBooks";
import "./BookDetails.css";

const BookDetails = () => {
  const { id } = useParams();
  const [bok, setBok] = useState<GoogleBooksVolume | null>(null);
  const [laddar, setLaddar] = useState(true);
  const [fel, setFel] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const hämta = async () => {
      try {
        setFel(null);
        setLaddar(true);
        const data = await hämtaBok(id);
        setBok(data);
      } catch (err) {
        setFel(
          err instanceof Error ? err.message : "Ett okänt fel inträffade."
        );
      } finally {
        setLaddar(false);
      }
    };

    hämta();
  }, [id]);

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
          <img
            src={bild}
            alt={`Omslag: ${titel}`}
            className="book-detail-cover"
          />
        )}

        <div className="book-detail-info">
          <h1 className="book-detail-title">{titel}</h1>
          <p className="book-detail-meta">
            <strong>Författare:</strong> {författare}
          </p>
          <p className="book-detail-meta">
            <strong>Publicerad:</strong> {datum}
          </p>

          <div
            className="book-detail-description"
            dangerouslySetInnerHTML={{ __html: beskrivning }}
          />
        </div>
      </div>

    </div>
  );
};

export default BookDetails;
