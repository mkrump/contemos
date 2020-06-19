import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import Icon from "./Icon";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    justifyContent: "center",
    alignItems: "center",
    appBarSpacer: theme.mixins.toolbar,
  },
}));

export default function Nav() {
  const classes = useStyles();
  return (
    <>
      <AppBar>
        <Toolbar className={classes.toolbar}>
          <Icon />
        </Toolbar>
      </AppBar>
    </>
  );
}
