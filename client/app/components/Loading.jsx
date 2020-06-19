import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

export default function Loading() {
  return (
    <Grid
      container
      spacing={4}
      direction="column"
      alignItems="center"
      justify="center"
    >
      <Grid item xs={12}>
        <Typography align="center">Generating Cards</Typography>
      </Grid>
      <CircularProgress />
    </Grid>
  );
}
