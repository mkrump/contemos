import Avatar from "@material-ui/core/Avatar";
import Language from "@material-ui/icons/Language";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    margin: theme.spacing(2, 0, 1, 0),
    backgroundColor: theme.palette.secondary.main,
  },
  text: {
    marginBottom: theme.spacing(1),
  },
}));

export default function Icon() {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Box>
        <Avatar className={classes.logo}>
          <Language />
        </Avatar>
      </Box>
      <Box>
        <Typography component="h1" variant="h5" className={classes.text}>
          ¡Contemos!
        </Typography>
      </Box>
    </Box>
  );
}
