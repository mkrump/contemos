import React, { useRef, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import ReactAudioPlayer from "react-audio-player";
import Alert from "@material-ui/lab/Alert";
import PropTypes from "prop-types";

import NumberFormatCustom from "./NumberFormat";

const useStyles = makeStyles((theme) => ({
  error: {
    margin: theme.spacing(2, 0, -2),
  },
  submit: {
    margin: theme.spacing(2, 0, 2),
  },
  audio: {
    marginTop: theme.spacing(2),
    maxWidth: "275px",
  },
}));

export default function Play({
  number,
  audioUrl,
  nextCardHandler,
  allowAudioReplay,
}) {
  const classes = useStyles();
  const [answer, setAnswer] = useState("");
  const [wrong, setWrong] = useState(false);
  const answerInput = useRef("");

  const handleFocus = () => {
    if (answerInput.current) {
      answerInput.current.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (wrong) {
      setAnswer("");
      setWrong(false);
      nextCardHandler(false);
      return;
    }
    if (answer !== number) {
      setWrong(true);
      return;
    }
    setAnswer("");
    setWrong(false);
    nextCardHandler(true);
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit} noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            autoComplete="off"
            required
            fullWidth
            autoFocus
            inputRef={answerInput}
            value={answer}
            name="answer"
            label="Answer"
            type="text"
            id="answer"
            onChange={(event) =>
              !event.target.value
                ? setAnswer("")
                : setAnswer(event.target.value)
            }
            InputProps={{
              inputComponent: NumberFormatCustom,
            }}
          />
          {wrong && (
            <Grid item xs={12} className={classes.error}>
              <Alert
                severity="error"
                variant="standard"
                icon={false}
                className={classes.error}
              >
                The correct answer was{" "}
                <strong>{parseInt(number, 10).toLocaleString()}</strong>
              </Alert>
            </Grid>
          )}
        </Grid>
        <Grid item xs={12}>
          <Button
            size="large"
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {wrong ? "Next\xa0\xa0" : "Submit"}
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <ReactAudioPlayer
            src={audioUrl}
            onPlay={handleFocus}
            className={classes.audio}
            autoPlay
            controls={allowAudioReplay}
          />
        </Grid>
      </Grid>
    </form>
  );
}

Play.propTypes = {
  number: PropTypes.string.isRequired,
  audioUrl: PropTypes.string.isRequired,
  nextCardHandler: PropTypes.func.isRequired,
  allowAudioReplay: PropTypes.bool,
};

Play.defaultProps = {
  allowAudioReplay: false,
};
