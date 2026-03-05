import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { API_URL } from "../api/config";

/*typer*/
interface Användare {
  id: number;
  namn: string;
  epost: string;
}

interface AuthSvar {
  token: string;
  användare: Användare;
}

interface AuthContextTyp {
  användare: Användare | null;
  token: string | null;
  inloggad: boolean;
  loggaIn: (epost: string, lösenord: string) => Promise<void>;
  registrera: (namn: string, epost: string, lösenord: string) => Promise<void>;
  loggaUt: () => void;
}

const AuthContext = createContext<AuthContextTyp | null>(null);

/*provider*/
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [användare, setAnvändare] = useState<Användare | null>(null);
  const [token, setToken] = useState<string | null>(null);

  /*läs sparad session vid sidladdning*/
  useEffect(() => {
    const sparadToken = localStorage.getItem("token");
    const sparadAnvändare = localStorage.getItem("användare");

    if (sparadToken && sparadAnvändare) {
      setToken(sparadToken);
      setAnvändare(JSON.parse(sparadAnvändare) as Användare);
    }
  }, []);

  /*sparar token och användare i state och localstorage*/
  const sparaSession = (data: AuthSvar) => {
    setToken(data.token);
    setAnvändare(data.användare);
    localStorage.setItem("token", data.token);
    localStorage.setItem("användare", JSON.stringify(data.användare));
  };

  const loggaIn = async (epost: string, lösenord: string) => {
    const svar = await fetch(`${API_URL}/api/auth/logga-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ epost, lösenord }),
    });

    if (!svar.ok) {
      const fel = await svar.json().catch(() => ({}));
      throw new Error((fel as { meddelande?: string }).meddelande ?? "Inloggning misslyckades.");
    }

    sparaSession((await svar.json()) as AuthSvar);
  };

  const registrera = async (namn: string, epost: string, lösenord: string) => {
    const svar = await fetch(`${API_URL}/api/auth/registrera`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ namn, epost, lösenord }),
    });

    if (!svar.ok) {
      const fel = await svar.json().catch(() => ({}));
      throw new Error((fel as { meddelande?: string }).meddelande ?? "Registrering misslyckades.");
    }

    sparaSession((await svar.json()) as AuthSvar);
  };

  /*rensar state och localstorage*/
  const loggaUt = () => {
    setAnvändare(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("användare");
  };

  return (
    <AuthContext.Provider
      value={{
        användare,
        token,
        inloggad: användare !== null,
        loggaIn,
        registrera,
        loggaUt,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/*hook för att använda auth i komponenter*/
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth måste användas inuti AuthProvider");
  }
  return context;
};
