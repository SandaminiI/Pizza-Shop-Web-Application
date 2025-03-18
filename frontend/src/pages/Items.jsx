import { useEffect, useState } from "react";
import axios from "axios";
import { Button, TextField, Select, MenuItem } from "@mui/material";

export default function Items() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", category: "Pizza", price: "" });

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

//   const addItem = async () => {
//     if (!newItem.name || !newItem.price) return;
//     try {
//       await axios.post("http://localhost:3001/items", newItem);
//       setNewItem({ name: "", category: "Pizza", price: "" });
//       fetchItems();
//     } catch (err) {
//       console.error("Error adding item", err);
//     }
//   };

// const addItem = async () => {
//     if (!newItem.name || !newItem.price) return; // Ensure all required fields are provided
  
//     try {
//       await axios.post("http://localhost:3001/items", newItem, {
//         headers: { "Content-Type": "application/json" }, // Ensure JSON is sent
//       });
  
//       setNewItem({ name: "", category: "Pizza", price: "" });
//       fetchItems(); // Refresh the items list
//     } catch (err) {
//       console.error("Error adding item", err.response ? err.response.data : err);
//     }
//   };
const addItem = async () => {
    if (!newItem.name || !newItem.price) return;
  
    try {
      await axios.post("http://localhost:3001/items", 
        { 
          ...newItem, 
          price: parseFloat(newItem.price) // Convert price to a number
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
      setNewItem({ name: "", category: "Pizza", price: "" });
      fetchItems();
    } catch (err) {
      console.error("Error adding item", err.response ? err.response.data : err);
    }
  };
  
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Item Management</h1>

      <div className="flex gap-4 mb-4">
        <TextField
          label="Item Name"
          variant="outlined"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <Select
          value={newItem.category}
          onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
        >
          <MenuItem value="Pizza">Pizza</MenuItem>
          <MenuItem value="Topping">Topping</MenuItem>
          <MenuItem value="Beverage">Beverage</MenuItem>
        </Select>
        <TextField
          label="Price"
          type="number"
          variant="outlined"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        />
        <Button variant="contained" color="primary" onClick={addItem}>
          Add Item
        </Button>
      </div>

      <ul className="border rounded p-4">
        {items.map((item) => (
          <li key={item.id|| item.ID} className="flex justify-between p-2 border-b">
            {item.name} - ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
