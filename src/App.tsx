import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BookDetails from "./pages/BookDetails";
import Login from "./pages/Login";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bok/:id" element={<BookDetails />} />
          <Route path="/logga-in" element={<Login />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
