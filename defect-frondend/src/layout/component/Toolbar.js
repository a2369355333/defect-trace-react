import AppBar from "@mui/material/AppBar";
import MuiToolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

const Toolbar = () => {
  return (
    <AppBar position="static">
      <MuiToolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Defect_Trace
        </Typography>
      </MuiToolbar>
    </AppBar>
  );
};

export default Toolbar;