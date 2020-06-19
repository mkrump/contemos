import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
  },
  submit: {
    marginTop: theme.spacing(10),
  },
}));

export default function Again({ onClickHandler }) {
  const classes = useStyles();
  const onClick = () => {
    onClickHandler();
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button
            type="button"
            autoFocus
            fullWidth
            className={classes.submit}
            variant="contained"
            color="primary"
            onClick={onClick}
          >
            Another Round?
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

Again.propTypes = {
  onClickHandler: PropTypes.func.isRequired,
};
