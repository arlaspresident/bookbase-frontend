import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

/*typer*/
interface Användare {
  id: number;
  namn: string;
  epost: string;
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

  /*kopplas t backend*/
  const loggaIn = async (_epost: string, _lösenord: string) => {};
  const registrera = async (_namn: string, _epost: string, _lösenord: string) => {};

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
