import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Button, TextField, Select, MenuItem, 
  Card, CardContent, Typography, Table, TableHead, TableRow, 
  TableCell, TableBody, Paper, Grid, Box, IconButton, Dialog, DialogActions, 
  DialogContent, DialogTitle, Snackbar, Alert
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

export default function Items() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", category: "Pizza", price: "" });
  const [editItem, setEditItem] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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

  const addItem = async () => {
    if (!newItem.name || !newItem.price) return;

    try {
      await axios.post("http://localhost:3001/items", 
        { ...newItem, price: parseFloat(newItem.price) },
        { headers: { "Content-Type": "application/json" } }
      );

      setNewItem({ name: "", category: "Pizza", price: "" });
      fetchItems();
    } catch (err) {
      console.error("Error adding item", err);
    }
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setOpenEditDialog(true);
  };

  const updateItem = async () => {
    if (!editItem.name || !editItem.price) return;

    const itemId = editItem.id || editItem.ID;

    try {
      await axios.put(`http://localhost:3001/items/${itemId}`, 
        { ...editItem, price: parseFloat(editItem.price) },
        { headers: { "Content-Type": "application/json" } }
      );

      setOpenEditDialog(false);
      setSnackbarOpen(true);  // Show success message
      fetchItems();
    } catch (err) {
      console.error("Error updating item", err);
    }
  };

  const confirmDeleteItem = (id) => {
    setDeleteItemId(id);
    setOpenDeleteDialog(true);
  };

  const deleteItem = async () => {
    try {
      await axios.delete(`http://localhost:3001/items/${deleteItemId}`);
      setOpenDeleteDialog(false);
      fetchItems();
    } catch (err) {
      console.error("Error deleting item", err);
    }
  };

  return (
    <Box className="flex flex-col items-center p-6 min-h-screen bg-gray-50">
      {/* Item Management Form */}
      <Card sx={{ width: 600, p: 3, mb: 4, boxShadow: 4, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h5" textAlign="center" gutterBottom>
            🍕 Item Management
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={3}>
              <TextField label="Item Name" fullWidth value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
            </Grid>
            <Grid item xs={3}>
              <Select fullWidth value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}>
                <MenuItem value="Pizza">Pizza</MenuItem>
                <MenuItem value="Topping">Topping</MenuItem>
                <MenuItem value="Beverage">Beverage</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={3}>
              <TextField label="Price ($)" type="number" fullWidth value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} />
            </Grid>
            <Grid item xs={3}>
              <Button variant="contained" color="primary" fullWidth sx={{ height: "100%" }} onClick={addItem}>
                Add Item
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Items List Table */}
      <Paper sx={{ width: 800, p: 2, boxShadow: 4, borderRadius: 2 }}>
        <Typography variant="h6" textAlign="center" gutterBottom>
          🛍️ Item List
        </Typography>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
              <TableCell>Category</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price ($)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length > 0 ? (
              items.map((item) => {
                const itemId = item.id || item.ID;
                return (
                  <TableRow key={itemId} hover>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => openEditModal(item)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => confirmDeleteItem(itemId)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No items added yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Edit Item Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <TextField label="Item Name" fullWidth margin="normal" value={editItem?.name || ""} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} />
          <Select fullWidth value={editItem?.category || "Pizza"} onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}>
            <MenuItem value="Pizza">Pizza</MenuItem>
            <MenuItem value="Topping">Topping</MenuItem>
            <MenuItem value="Beverage">Beverage</MenuItem>
          </Select>
          <TextField label="Price ($)" type="number" fullWidth margin="normal" value={editItem?.price || ""} onChange={(e) => setEditItem({ ...editItem, price: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={updateItem}>Update</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this item?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={deleteItem}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="success" sx={{ width: "100%" }}>
          Item updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
