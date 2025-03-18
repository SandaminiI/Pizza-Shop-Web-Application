import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Items from "./pages/Items";
import Invoices from "./pages/Invoices";

function App() {
  return (
    <Router>
      <div className="p-4">
        <nav className="flex gap-4 mb-4">
          <Link to="/" className="text-blue-500">Item Management</Link>
          <Link to="/invoices" className="text-blue-500">Invoice Management</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Items />} />
          <Route path="/invoices" element={<Invoices />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
