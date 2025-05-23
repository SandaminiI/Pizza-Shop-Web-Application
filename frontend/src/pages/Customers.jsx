import { useEffect, useState } from "react";
import axios from "axios";
import {
  Button, TextField, Card, CardContent, Typography, Table, TableHead,
  TableRow, TableCell, TableBody, Paper, Box, IconButton, Dialog, 
  DialogActions, DialogContent, DialogTitle, Snackbar, Alert, Container, Stack
} from "@mui/material";
import { Delete } from "@mui/icons-material";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "" });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteCustomerId, setDeleteCustomerId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:3001/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error("Error fetching customers", err);
    }
  };

  const addCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone) return;
    try {
      await axios.post("http://localhost:3001/customers", newCustomer);
      setNewCustomer({ name: "", phone: "" });
      fetchCustomers();
    } catch (err) {
      console.error("Error adding customer", err);
    }
  };

  const confirmDeleteCustomer = (id) => {
    setDeleteCustomerId(id);
    setOpenDeleteDialog(true);
  };

  const deleteCustomer = async () => {
    try {
      await axios.delete(`http://localhost:3001/customers/${deleteCustomerId}`);
      setOpenDeleteDialog(false);
      setSnackbarOpen(true);
      fetchCustomers();
    } catch (err) {
      console.error("Error deleting customer", err);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight="bold" textAlign="center" gutterBottom>
        Customers
      </Typography>
      
      <Card elevation={3} sx={{ mb: 4, p: 3, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Add New Customer
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField label="Customer Name" fullWidth value={newCustomer.name} 
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })} />
            <TextField label="Phone Number" fullWidth value={newCustomer.phone} 
              onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })} />
            <Button variant="contained" color="primary" onClick={addCustomer}>
              Add
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Paper elevation={3} sx={{ borderRadius: 3, p: 2 }}>
        <Typography variant="h6" textAlign="center" gutterBottom>
          Customer List
        </Typography>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <TableRow key={customer.id} hover>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    <IconButton color="error" onClick={() => confirmDeleteCustomer(customer.ID)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this customer?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={deleteCustomer}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="success" sx={{ width: "100%" }}>
          Customer deleted successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
}
