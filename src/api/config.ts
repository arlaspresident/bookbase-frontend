/*url till backend*/
export const API_URL = "http://localhost:3001";

/*returnerar headers med jwt token för skyddade anrop*/
export const authHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
});
