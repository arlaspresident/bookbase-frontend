import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { hämtaBok } from "../api/googleBooks";

const BookDetails = () => {
  const { id } = useParams();
  const [bok, setBok] = useState<any>(null);
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

  if (laddar) return <p>Laddar bokdetaljer...</p>;
  if (fel) return <p style={{ color: "crimson" }}>{fel}</p>;
  if (!bok) return <p>Ingen bok hittades.</p>;

  const info = bok.volumeInfo;
  const titel = info.title ?? "Okänd titel";
  const författare = info.authors?.join(", ") ?? "Okänd författare";
  const datum = info.publishedDate ?? "Okänt datum";
  const beskrivning = info.description ?? "Ingen beskrivning tillgänglig.";
  const bild =
    info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail;

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>
      <Link to="/">← Tillbaka</Link>

      <h1>{titel}</h1>
      <p><strong>Författare:</strong> {författare}</p>
      <p><strong>Publicerad:</strong> {datum}</p>

      {bild && (
        <img
          src={bild}
          alt={`Omslag: ${titel}`}
          style={{ margin: "16px 0", maxWidth: 200 }}
        />
      )}

      <div
        dangerouslySetInnerHTML={{ __html: beskrivning }}
        style={{ marginTop: 16 }}
      />
    </div>
  );
};

export default BookDetails;