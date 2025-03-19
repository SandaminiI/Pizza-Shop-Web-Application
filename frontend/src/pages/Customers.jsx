import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Button, TextField, Card, CardContent, Typography, Table, TableHead, 
  TableRow, TableCell, TableBody, Paper, Grid, Box, IconButton, Dialog, DialogActions, 
  DialogContent, DialogTitle, Snackbar, Alert 
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
      await axios.post("http://localhost:3001/customers", newCustomer, { headers: { "Content-Type": "application/json" } });

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
    <Box className="flex flex-col items-center p-6 min-h-screen bg-gray-50">
      {/* Customer Management Form */}
      <Card sx={{ width: 600, p: 3, mb: 4, boxShadow: 4, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" textAlign="center" gutterBottom>
            🧑‍💼 Customer Management
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={5}>
              <TextField label="Customer Name" fullWidth value={newCustomer.name} onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })} />
            </Grid>
            <Grid item xs={5}>
              <TextField label="Phone Number" fullWidth value={newCustomer.phone} onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })} />
            </Grid>
            <Grid item xs={2}>
              <Button variant="contained" color="primary" fullWidth sx={{ height: "100%" }} onClick={addCustomer}>
                Add
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Customers List Table */}
      <Paper sx={{ width: 600, p: 2, boxShadow: 4, borderRadius: 2 }}>
        <Typography variant="h6" textAlign="center" gutterBottom>
          🛍️ Customer List
        </Typography>

        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Actions</TableCell>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this customer?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={deleteCustomer}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="success" sx={{ width: "100%" }}>
          Customer deleted successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
