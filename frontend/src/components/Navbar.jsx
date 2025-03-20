import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#161179" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Pizza Billing App
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Items
        </Button>
        <Button color="inherit" component={Link} to="/customers">
          Customers
        </Button>
        <Button color="inherit" component={Link} to="/invoices">
          Invoices
        </Button>
      </Toolbar>
    </AppBar>
  );
}
