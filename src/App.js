
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import NoPage from "./pages/NoPage";
import Diagrams from "./pages/diagrams";
import SqlScripts from "./pages/SqlScripts";
import ThreeDeePrints from "./pages/3dprints";
import Users from "./pages/Users";
import './App.css';




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="diagrams" element={<Diagrams />} />
          <Route path="contact" element={<Contact />} />
          <Route path="sqlscripts" element={<SqlScripts />} />
          <Route path="3dprints" element={<ThreeDeePrints />} />
          <Route path="users" element={<Users />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
