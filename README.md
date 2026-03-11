# BookBase

En bokrecensionsplattform där användare kan söka efter böcker, läsa recensioner och skriva egna

## Tekniker

- React 19 + TypeScript
- Vite
- React Router v6
- CSS med CSS variabler 
- Google Books API
- JWT autentisering mot Express.js backend

## Funktioner

- Sök efter böcker via Google Books API med filter för genre och språk
- Visa bokdetaljer (titel, författare, beskrivning, omslagsbild)
- Registrera konto och logga in
- Skriv, redigera och ta bort egna recensioner
- Sida för mina recensioner med omslagsbilder och direktlänkar till böcker
- Responsiv design för mobil och desktop

## Kom igång

Projektet kräver att backend-servern körs lokalt på port 3001.

### 1. Klona och installera

```bash
git clone https://github.com/arlaspresident/bookbase-frontend.git
cd bookbase-frontend
npm install
```

### 2. Starta backend

Se backend repots README för instruktioner. Backend ska köra på `http://localhost:3001`.

### 3. Starta frontend

```bash
npm run dev
```

Öppna [http://localhost:5173](http://localhost:5173) i webbläsaren.


