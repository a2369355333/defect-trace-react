import React from "react";
import AppBar from "@mui/material/AppBar";
import MuiToolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

const Toolbar: React.FC = () => {
  return (
    <AppBar position="static">
      {/* Material-UI Toolbar container */}
      <MuiToolbar>
        {/* Title text */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Defect_Trace
        </Typography>
      </MuiToolbar>
    </AppBar>
  );
};

export default Toolbar;
