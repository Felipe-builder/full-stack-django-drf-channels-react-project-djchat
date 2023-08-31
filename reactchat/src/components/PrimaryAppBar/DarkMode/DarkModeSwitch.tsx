import { useTheme } from "@mui/material/styles";
import { useContext } from "react";
import { ColorModeContext } from "../../../context/DarkModeContext";
import { IconButton, Typography } from "@mui/material";
import { Brightness4Rounded, ToggleOffRounded, ToggleOnRounded } from "@mui/icons-material";

const DarkModeSwitch = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  return (
    <>
      <Brightness4Rounded
          sx={{ marginRight: '6px', fontSize: '20px'}}
      />
      <Typography variant="body2" sx={{ textTransform: 'capitalize'}}>
        {theme.palette.mode} mode
      </Typography>
      <IconButton
        sx={{ m: 0, p: 0, pl: 2}}
        onClick={colorMode.toggleColorMode}
        color="inherit"
      >
        {theme.palette.mode === 'dark' ? (
          <ToggleOffRounded  sx={{ fontSize: '2.5rem', p: 0 }}/>
        ) : (
          <ToggleOnRounded sx={{ fontSize: '2.5rem'}}/>
        )}
      </IconButton>
    </>
  )
}

export default DarkModeSwitch