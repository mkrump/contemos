import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
    margin: theme.spacing(4, 0, 2, 0),
  },
  text: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    color: "#3f51b5",
  },
}));

export default function Score({ correct, attempted, remaining }) {
  const classes = useStyles();
  return (
    <Grid container className={classes.root}>
      <Grid item xs={6}>
        <Typography className={classes.text} align="left">
          <strong>Score: </strong> {correct}/{attempted}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography className={classes.text} align="right">
          <strong>Remaining: </strong> {remaining}
        </Typography>
      </Grid>
    </Grid>
  );
}

Score.propTypes = {
  correct: PropTypes.number.isRequired,
  attempted: PropTypes.number.isRequired,
  remaining: PropTypes.number.isRequired,
};
