import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Items from "./pages/Items";
import Invoices from "./pages/Invoices";
import Customers from "./pages/Customers";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar/>
        <Routes>
          <Route path="/" element={<Items />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/customers" element={<Customers />} />
        </Routes>
    </Router>
  );
}

export default App;
