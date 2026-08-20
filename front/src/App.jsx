import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Formations from "./pages/Formations";
import Offers from "./pages/Offers";
import Checklist from "./pages/Checklist";
import Aids from "./pages/Aids";
import Chat from "./pages/Chat";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/formations" element={<Formations />} />
        <Route path="/offres" element={<Offers />} />
        <Route path="/checklist" element={<Checklist />} />
        <Route path="/aides" element={<Aids />} />
        <Route path="/chat" element={<Chat />} />
      </Route>
    </Routes>
  );
}

export default App;
