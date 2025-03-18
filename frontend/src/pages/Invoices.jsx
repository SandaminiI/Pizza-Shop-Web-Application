import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Button, TextField, Select, MenuItem } from "@mui/material";
import { useReactToPrint } from "react-to-print";

export default function Invoices() {
  const [items, setItems] = useState([]); // Available items
  const [invoiceItems, setInvoiceItems] = useState([]); // Items added to invoice
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [total, setTotal] = useState(0);

  const invoiceRef = useRef(); // Reference for printing

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:3001/items");
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items", err);
    }
  };

  const addItemToInvoice = (item) => {
    const existingItem = invoiceItems.find((i) => i.item_id === item.item_id);
    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.subtotal = existingItem.quantity * item.price;
      setInvoiceItems([...invoiceItems]);
    } else {
      setInvoiceItems([...invoiceItems, { ...item, quantity: 1, subtotal: item.price }]);
    }
    calculateTotal();
  };

  const calculateTotal = () => {
    const totalAmount = invoiceItems.reduce((acc, item) => acc + item.subtotal, 0);
    setTotal(totalAmount);
  };

  const printInvoice = useReactToPrint({
    content: () => invoiceRef.current,
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Invoice Management</h1>

      <div className="flex gap-4 mb-4">
        <TextField label="Customer Name" variant="outlined" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
        <TextField label="Phone" variant="outlined" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
      </div>

      <h2 className="text-xl font-semibold">Select Items</h2>
      <div className="grid grid-cols-3 gap-4 mt-2">
        {items.map((item) => (
          <Button key={item.item_ID} variant="contained" onClick={() => addItemToInvoice(item)}>
            {item.name} - ${item.price}
          </Button>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-6">Invoice Items</h2>
      <div className="border rounded p-4">
        <ul>
          {invoiceItems.map((item, index) => (
            <li key={index} className="flex justify-between p-2 border-b">
              {item.name} x {item.quantity} = ${item.subtotal}
            </li>
          ))}
        </ul>
        <h3 className="text-lg font-bold mt-4">Total: ${total.toFixed(2)}</h3>
      </div>

      <div className="mt-4 flex gap-4">
        <Button variant="contained" color="secondary" onClick={printInvoice}>
          Print Invoice
        </Button>
      </div>

      {/* Invoice Print Layout */}
      <div className="hidden" ref={invoiceRef}>
        <h1 className="text-2xl font-bold">Invoice</h1>
        <p>Customer: {customer.name}</p>
        <p>Phone: {customer.phone}</p>
        <ul>
          {invoiceItems.map((item, index) => (
            <li key={index}>
              {item.name} x {item.quantity} = ${item.subtotal}
            </li>
          ))}
        </ul>
        <h3 className="text-lg font-bold">Total: ${total.toFixed(2)}</h3>
      </div>
    </div>
  );
}
