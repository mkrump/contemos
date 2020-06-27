import React, { useContext } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import { IdentityContext } from "../identityContext";

const useStyles = makeStyles(() => ({
  main: {
    maxWidth: "750px",
  },
  loginbutton: {
    marginTop: "50px",
    maxWidth: "295px",
  },
}));

export default function Login() {
  const classes = useStyles();
  const { identity: netlifyIdentity } = useContext(IdentityContext);

  return (
    <div className={classes.main}>
      <Grid container align="center" justify="center" alignItems="center">
        <Grid item xs={12}>
          <Typography color="textPrimary" variant="h4" gutterBottom>
            Practice audio comprehension of numbers in your target language.
          </Typography>
          <Typography color="textSecondary" variant="caption">
            *Supports Arabic, English, French, German, Hindi, Italian, Japanese,
            Korean, Mandarin Chinese, Portuguese, Russian and Spanish.
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.loginbutton}>
          <Button
            size="large"
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => {
              netlifyIdentity.open();
            }}
          >
            Log In
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
