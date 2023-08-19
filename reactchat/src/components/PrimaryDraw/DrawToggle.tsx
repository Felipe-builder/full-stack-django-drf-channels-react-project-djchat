import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material"
import React from 'react'

type Props = {
  open: boolean;
  handlerDrawerOpen: () => void;
  handlerDrawerClose: () => void;
}

const DrawerToggle: React.FC<Props> = ({
  open,
  handlerDrawerOpen,
  handlerDrawerClose
}) => {
  return (
    <Box
      sx={{
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center" 
      }}
    >
      <IconButton
        onClick={open ? handlerDrawerClose : handlerDrawerOpen}
      >
        {
          open ? <ChevronLeft /> : <ChevronRight/>
        }
      </IconButton>
    </Box>
  )
}

export default DrawerToggle;