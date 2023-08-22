import { Box, Typography } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { BASE_URL } from '../../config';

import useAxiosWithInterceptor from "../../helpers/jwtinterceptor";


const SecondaryDraw = () => {
  const theme = useTheme();
  const jwtAxios = useAxiosWithInterceptor()

  jwtAxios
    .get(BASE_URL+'/server/select/?category=Programa%C3%A7%C3%A3o')
    .then(response => {
      console.log(response.data)
    }).catch(error => {
      console.log(error)
    })

  return (
    <Box
      sx={{
        minWidth: `${theme.secondaryDraw.width}px`,
        height: `calc(100vh - ${theme.primaryAppBar.height}px )`,
        mt: `${theme.primaryAppBar.height}px`,
        borderRight: `1px solid ${theme.palette.divider}`,
        display: { xs: "none", sm: "block"},
        overflow: "auto",
      }}
    >
      {
        [...Array(50)].map((_, i) => (
          <Typography key={i} paragraph>
            {i + 1}
          </Typography>
        ))
      }
    </Box>
  )
}

export default SecondaryDraw