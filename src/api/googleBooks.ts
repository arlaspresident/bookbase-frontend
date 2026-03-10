import type { GoogleBooksSearchResponse, GoogleBooksVolume } from "../types/googleBooks";

interface SökFilter {
  språk?: string;
  ämne?: string;  
}

export async function sökBöcker(query: string, filter?: SökFilter): Promise<GoogleBooksVolume[]> {
  const q = query.trim();
  if (!q) return [];

  /*lägg till ämnesfilter direkt i söksträngen om de är valt*/
  const sökSträng = filter?.ämne ? `${q}+subject:${filter.ämne}` : q;

  const params = new URLSearchParams({
    q: sökSträng,
    maxResults: "20",
  });

  if (filter?.språk) params.set("langRestrict", filter.språk);

  const url = `https://www.googleapis.com/books/v1/volumes?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Kunde inte hämta böcker från google books.");
  }

  const data = (await res.json()) as GoogleBooksSearchResponse;
  return data.items ?? [];
}

export async function hämtaBok(id: string): Promise<GoogleBooksVolume> {
  const url = `https://www.googleapis.com/books/v1/volumes/${id}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Kunde inte hämta bokdetaljer.");
  }

  return (await res.json()) as GoogleBooksVolume;
}