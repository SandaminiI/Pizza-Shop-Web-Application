import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Button, Select, MenuItem, Card, CardContent, Typography, Table, TableRow, 
  TableCell, TableBody, Paper, Grid, Box 
} from "@mui/material";

export default function Invoices() {
  const [customers, setCustomers] = useState([]);  
  const [items, setItems] = useState([]);  
  const [invoiceItems, setInvoiceItems] = useState([]);  
  const [customerId, setCustomerId] = useState("");  

  useEffect(() => {
    fetchCustomers();
    fetchItems();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:3001/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error("Error fetching customers", err);
    }
  };

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:3001/items");
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items", err);
    }
  };

  const addItemToInvoice = (item) => {
    const existingItem = invoiceItems.find((i) => i.item_id === (item.id || item.ID));
    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.subtotal = existingItem.quantity * item.price;
      setInvoiceItems([...invoiceItems]);
    } else {
      setInvoiceItems([...invoiceItems, { item_id: item.id || item.ID, name: item.name, quantity: 1, subtotal: item.price }]);
    }
  };

  const createInvoice = async () => {
    if (!customerId || invoiceItems.length === 0) return;

    try {
      await axios.post("http://localhost:3001/invoices", { customer_id: customerId, items: invoiceItems }, { headers: { "Content-Type": "application/json" } });

      setCustomerId("");
      setInvoiceItems([]);
    } catch (err) {
      console.error("Error creating invoice", err);
    }
  };

  // Calculate total amount
  const totalAmount = invoiceItems.reduce((acc, item) => acc + item.subtotal, 0);

  return (
    <Box className="flex flex-col items-center p-6 min-h-screen bg-gray-50">
      <Card sx={{ width: 600, p: 3, mb: 4, boxShadow: 4, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" textAlign="center" gutterBottom>
            🧾 Invoice Management
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={8}>
              <Select 
                fullWidth 
                value={customerId || ""}  
                onChange={(e) => setCustomerId(e.target.value)}
              >
                <MenuItem value="">Select Customer</MenuItem>
                {customers.length > 0 && customers.map((customer) => (
                  <MenuItem key={customer.id || customer.ID} value={customer.id || customer.ID}>
                    {customer.name} - {customer.phone}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={4}>
              <Button variant="contained" color="primary" fullWidth sx={{ height: "100%" }} onClick={createInvoice}>
                Create Invoice
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Paper sx={{ width: 600, p: 2, boxShadow: 4, borderRadius: 2 }}>
        <Typography variant="h6" textAlign="center" gutterBottom>
          🛒 Add Items to Invoice
        </Typography>

        <Grid container spacing={1}>
          {items.length > 0 ? (
            items.map((item) => (
              <Grid item key={item.id || item.ID} xs={4}>
                <Button variant="outlined" fullWidth onClick={() => addItemToInvoice(item)}>
                  {item.name} - ${item.price}
                </Button>
              </Grid>
            ))
          ) : (
            <Typography textAlign="center" color="gray">No items available.</Typography>
          )}
        </Grid>
      </Paper>

      <Paper sx={{ width: 600, p: 2, mt: 3, boxShadow: 4, borderRadius: 2 }}>
        <Typography variant="h6" textAlign="center" gutterBottom>
          📝 Invoice Summary
        </Typography>
        <Table>
          <TableBody>
            {invoiceItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${item.subtotal.toFixed(2)}</TableCell>
              </TableRow>
            ))}
            {invoiceItems.length > 0 && (
              <TableRow>
                <TableCell colSpan={2}><strong>Total</strong></TableCell>
                <TableCell><strong>${totalAmount.toFixed(2)}</strong></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
