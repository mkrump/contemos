import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import { navigate } from "@reach/router";
import Link from "@material-ui/core/Link";

import { IdentityContext } from "../identityContext";

import Icon from "./Icon";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    justifyContent: "center",
    alignItems: "center",
    appBarSpacer: theme.mixins.toolbar,
  },
  appBar: {
    // dont cover login modal on mobil
    zIndex: -1,
  },
  logout: {
    padding: theme.spacing(0, 3, 1, 0),
    fontSize: ".9rem",
    color: "white",
  },
}));

export default function Nav() {
  const classes = useStyles();
  const { identity: netlifyIdentity, user } = useContext(IdentityContext);
  return (
    <>
      <AppBar position="fixed" className={user ? null : classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <Icon />
        </Toolbar>
        {user ? (
          <Grid item xs={12} align="right">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <Link
              component="button"
              underline="hover"
              className={classes.logout}
              onClick={() => {
                netlifyIdentity.logout();
                navigate("/");
              }}
            >
              Log Out
            </Link>
          </Grid>
        ) : null}
      </AppBar>
    </>
  );
}
