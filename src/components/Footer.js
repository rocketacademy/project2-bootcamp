import React from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import {
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  GitHub,
  YouTube,
} from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        backgroundColor: "#386150",
        paddingTop: "3rem",
        paddingBottom: "0rem",
      }}
    >
      <Container maxWidth="lg">
        <Grid container direction="column" alignItems="flex-end">
          <Grid item xs={12}>
            <Typography color="white" variant="h5">
              The Spork App
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography color="white" variant="subtitle1">
              {`Copyright ${new Date().getFullYear()} - All Rights Reserved | Alayne | Eng Lin | Jerry`}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Facebook />
            <Twitter />
            <LinkedIn />
            <Instagram />
            <GitHub />
            <YouTube />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
