import { useParams } from "react-router-dom";
import useCrud from "../../hooks/useCrud";
import { useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";

interface Server {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: string;
}

const ExploreServers = () => {
  const { categoryName } = useParams();
  console.log(categoryName)
  const url = categoryName ? `server/select/?category=${categoryName}`: '/server/select';
  const { dataCRUD, fetchData} = useCrud<Server>([], url);

  useEffect(() => {
    fetchData();
  }, [categoryName])

  return (
    <>
      <Container maxWidth='lg'>
        <Box sx={{pt: 6}}>
          <Typography
            variant="h3"
            noWrap
            component='h1'
            sx={{
              display: {
                sm:'block',
                fontWeight: 700,
                fontSize: '48px',
                letterSpacing: '-2px'
              },
              textAlign: {
                xs: 'center', sm: 'left'
              }
            }}
          >
            {categoryName ? categoryName : 'Popular Channel'}
          </Typography>
        </Box>
        <Box sx={{pt: 6}}>
          <Typography
            variant="h6"
            noWrap
            component='h2'
            color='textSecondary'
            sx={{
              display: {
                sm:'block',
                fontWeight: 700,
                fontSize: '48px',
                letterSpacing: '-2px'
              },
              textAlign: {
                xs: 'center', sm: 'left'
              }
            }}
          >
            {categoryName ? `Channels talking about ${categoryName}` : 'Check out some of our Popular Channels'}
          </Typography>
        </Box>
        <Typography
          variant="h6"
          sx={{
            pt: 6,
            pb: 1,
            fontWeight: 700,
            letterSpacing: '-1px'
          }}
        >
          Recommended Channels
        </Typography>
      </Container>
    </>
  )

}

export default ExploreServers;