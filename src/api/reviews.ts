import { API_URL, authHeaders } from "./config";

/*typer*/
export interface Recension {
  id: number;
  bokId: string;
  bokTitel: string;
  användarId: number;
  användarnamn: string;
  text: string;
  betyg: number;
  skapadDatum: string;
}

/*hämtar inloggad användares recensioner*/
export async function hämtaMinaRecensioner(): Promise<Recension[]> {
  const svar = await fetch(`${API_URL}/api/recensioner/mina`, {
    headers: authHeaders(),
  });

  if (!svar.ok) throw new Error("Kunde inte hämta recensioner.");
  return (await svar.json()) as Recension[];
}

/*hämtar alla recensioner för en bok*/
export async function hämtaRecensioner(bokId: string): Promise<Recension[]> {
  const svar = await fetch(`${API_URL}/api/recensioner/${bokId}`);

  if (!svar.ok) throw new Error("Kunde inte hämta recensioner.");
  return (await svar.json()) as Recension[];
}

/*skapar en ny recension*/
export async function skapaRecension(
  bokId: string,
  bokTitel: string,
  text: string,
  betyg: number
): Promise<Recension> {
  const svar = await fetch(`${API_URL}/api/recensioner`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ bokId, bokTitel, text, betyg }),
  });

  if (!svar.ok) throw new Error("Kunde inte spara recensionen.");
  return (await svar.json()) as Recension;
}

/*uppdaterar en recension*/
export async function uppdateraRecension(
  id: number,
  text: string,
  betyg: number
): Promise<Recension> {
  const svar = await fetch(`${API_URL}/api/recensioner/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ text, betyg }),
  });

  if (!svar.ok) throw new Error("Kunde inte uppdatera recensionen.");
  return (await svar.json()) as Recension;
}

/*tar bort en recension*/
export async function taBortRecension(id: number): Promise<void> {
  const svar = await fetch(`${API_URL}/api/recensioner/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!svar.ok) throw new Error("Kunde inte ta bort recensionen.");
}
