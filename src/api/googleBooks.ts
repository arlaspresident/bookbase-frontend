import type { GoogleBooksSearchResponse, GoogleBooksVolume } from "../types/googleBooks";

export async function sökBöcker(query: string): Promise<GoogleBooksVolume[]> {
  const q = query.trim();
  if (!q) return [];

  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=20`;

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