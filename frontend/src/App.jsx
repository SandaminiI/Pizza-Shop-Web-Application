import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Items from "./pages/Items";
import Invoices from "./pages/Invoices";
import Customers from "./pages/Customers";

function App() {
  return (
    <Router>
      <div className="p-4">
        <nav className="flex gap-4 mb-4">
          <Link to="/" className="text-blue-500">Item Management</Link>
          <Link to="/invoices" className="text-blue-500">Invoice Management</Link>
          <Link to="/customers" className="text-blue-500">Customers Management</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Items />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/customers" element={<Customers />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
