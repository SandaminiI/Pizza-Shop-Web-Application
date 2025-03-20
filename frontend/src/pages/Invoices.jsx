import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { 
  Button, Select, MenuItem, Card, CardContent, Typography, Table, TableHead, 
  TableRow, TableCell, TableBody, Paper, Grid, Box, Dialog, DialogActions, 
  DialogContent, Container
} from "@mui/material";

export default function Invoices() {
  const [customers, setCustomers] = useState([]);  
  const [items, setItems] = useState([]);  
  const [invoiceItems, setInvoiceItems] = useState([]);  
  const [customerId, setCustomerId] = useState("");  
  const [openInvoicePopup, setOpenInvoicePopup] = useState(false); 
  const invoiceRef = useRef(null);

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

      setOpenInvoicePopup(true);
    } catch (err) {
      console.error("Error creating invoice", err);
    }
  };

  const totalAmount = invoiceItems.reduce((acc, item) => acc + item.subtotal, 0);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            hr { margin: 10px 0; }
          </style>
        </head>
        <body>
          ${invoiceRef.current.innerHTML}
          <script>
            window.onload = function() { window.print(); window.close(); };
          </script>
        </body>
      </html>
    `);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" textAlign="center" gutterBottom sx={{ fontWeight: "bold" }}>
            🧾 Invoice Management
          </Typography>
      <Card sx={{ width: 780, p: 3, mb: 4, boxShadow: 4, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6"  gutterBottom>
            Select customer
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

      <Paper sx={{ width: 800, p: 2, boxShadow: 4, borderRadius: 2, height:150 }}>
        <Typography variant="h6"  gutterBottom>
          🛒 Add Items to Invoice
        </Typography>

        <Grid container spacing={1}>
          {items.length > 0 ? (
            items.map((item) => (
              <Grid item key={item.id || item.ID} xs={4}>
                <Button variant="outlined" fullWidth onClick={() => addItemToInvoice(item)}>
                  {item.name} - Rs.{item.price}
                </Button>
              </Grid>
            ))
          ) : (
            <Typography textAlign="center" color="gray">No items available.</Typography>
          )}
        </Grid>
      </Paper>

      <Paper sx={{ width: 800, p: 2, mt: 4, boxShadow: 4, borderRadius: 2 }}>
        <Typography variant="h6" textAlign="center" gutterBottom>
          📝 Invoice Summary
        </Typography>
        <Table>
          <TableBody>
            {invoiceItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>Rs.{item.subtotal.toFixed(2)}</TableCell>
              </TableRow>
            ))}
            {invoiceItems.length > 0 && (
              <TableRow>
                <TableCell colSpan={2}><strong>Total</strong></TableCell>
                <TableCell><strong>Rs.{totalAmount.toFixed(2)}</strong></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={openInvoicePopup} onClose={() => setOpenInvoicePopup(false)} PaperProps={{sx: { width: '400px' }}}>
        <DialogContent>
        <Typography variant="h6" align="center">
              Invoice created successfully!
            </Typography>
          <div ref={invoiceRef} style={{ padding: "10px", fontFamily: "Arial, sans-serif" }}>
            <Typography variant="h6" align="center" gutterBottom>
              🏪 Invoice
            </Typography>
            <Typography variant="h8">
              Customer Name: {customers.find(c => c.id === customerId || c.ID === customerId)?.name || "Unknown"}
            </Typography><br/>
            <Typography variant="h8">
              Phone Number: {customers.find(c => c.id === customerId || c.ID === customerId)?.phone || "Unknown"}
            </Typography>
            <hr />
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Item</strong></TableCell>
                  <TableCell><strong>Qty</strong></TableCell>
                  <TableCell><strong>Price</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoiceItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>Rs.{item.subtotal.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Typography variant="h6" align="right" style={{ marginTop: "10px" }}>
              <strong>Total: Rs.{totalAmount.toFixed(2)}</strong>
            </Typography>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInvoicePopup(false)}>Close</Button>
          <Button variant="contained" color="secondary" onClick={handlePrint}>Print Invoice</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}