import React, { useContext } from "react";
import { Router } from "@reach/router";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

import { IdentityContext } from "../identityContext";

import Copyright from "./Footer";
import Nav from "./Nav";
import Game from "./Game";
import Login from "./Login";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
  },
  main: {
    marginTop: "130px",
    flexGrow: 1,
  },
  footer: {
    flexShrink: 0,
    marginBottom: theme.spacing(4),
  },
}));

const App = ({ children }) => {
  const classes = useStyles();
  return (
    <Container component="main" className={classes.container}>
      <CssBaseline />
      <Nav className={classes.nav} />
      <div className={classes.main}>{children}</div>
      <Box className={classes.footer} mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
};

const Home = () => {
  const { user } = useContext(IdentityContext);
  return <App>{!user ? <Login /> : <Game />}</App>;
};

export default () => {
  return (
    <Router>
      <Home path="/" />
    </Router>
  );
};

App.propTypes = {
  children: PropTypes.element.isRequired,
};
