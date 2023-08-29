import { Box, Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { ReactNode } from "react"

type Props = {
  children: ReactNode
}

const Main: React.FC<Props> = ({children}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        flexGrow: 1,
        height: `calc(100vh - ${theme.primaryAppBar.height}px )`,
        mt: `${theme.primaryAppBar.height}px`,
        overflow: "hidden"
      }}
    >
      {children}
    </Box>
  )
}

export default Main