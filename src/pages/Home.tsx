import { useState } from "react";
import { Link } from "react-router-dom";
import { sökBöcker } from "../api/googleBooks";
import type { GoogleBooksVolume } from "../types/googleBooks";

const Home = () => {
  const [sökterm, setSökterm] = useState("");
  const [böcker, setBöcker] = useState<GoogleBooksVolume[]>([]);
  const [laddar, setLaddar] = useState(false);
  const [fel, setFel] = useState<string | null>(null);

  const hanteraSök = async (e: React.FormEvent) => {
    e.preventDefault();

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
    <div style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>
      <h1>BookBase</h1>

      <form onSubmit={hanteraSök} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <label style={{ display: "none" }} htmlFor="sökterm">
          Sök efter böcker
        </label>

        <input
          id="sökterm"
          type="text"
          value={sökterm}
          onChange={(e) => setSökterm(e.target.value)}
          placeholder="Sök på titel, författare, ämne..."
          style={{ flex: 1, padding: 10 }}
        />

        <button type="submit" disabled={laddar || sökterm.trim().length === 0} style={{ padding: "10px 14px" }}>
          Sök
        </button>
      </form>

      {laddar && <p>Laddar...</p>}
      {fel && <p style={{ color: "crimson" }}>{fel}</p>}

      {!laddar && !fel && böcker.length === 0 && (
        <p>Skriv något i sökfältet och tryck på sök</p>
      )}

      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
        {böcker.map((bok) => {
          const info = bok.volumeInfo;
          const titel = info.title ?? "Okänd titel";
          const författare = info.authors?.join(", ") ?? "Okänd författare";
          const bild = info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail;

          return (
            <li key={bok.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
              <div style={{ display: "flex", gap: 12 }}>
                {bild ? (
                  <img
                    src={bild}
                    alt={`Omslag: ${titel}`}
                    style={{ width: 80, height: "auto", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    style={{ width: 80, height: 120, background: "#f2f2f2", borderRadius: 6 }}
                  />
                )}

                <div style={{ flex: 1 }}>
                  <h2 style={{ margin: "0 0 6px 0", fontSize: 18 }}>{titel}</h2>
                  <p style={{ margin: 0 }}>{författare}</p>

                  <div style={{ marginTop: 10 }}>
                    <Link to={`/bok/${bok.id}`}>Visa detaljer</Link>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Home;