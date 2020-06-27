import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import PropTypes from "prop-types";

import NumberFormatCustom from "./NumberFormat";

const useStyles = makeStyles((theme) => ({
  form: {
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 1),
  },
}));

const LANGUAGES = [
  { name: "Arabic", code: "ar-XA" },
  { name: "English", code: "en-US" },
  { name: "French", code: "fr-FR" },
  { name: "German", code: "de-DE" },
  { name: "Hindi", code: "hi-IN" },
  { name: "Italian", code: "it-IT" },
  { name: "Japanese", code: "ja-JP" },
  { name: "Korean", code: "ko-KR" },
  { name: "Mandarin Chinese", code: "cmn-CN" },
  { name: "Portuguese", code: "pt-BR" },
  { name: "Russian", code: "ru-RU" },
  { name: "Spanish", code: "es-US" },
];

const ROUNDS = [5, 10, 25];

export default function Options({
  submitHandler,
  initialLowerBound,
  initialUpperBound,
  initialRounds,
  initialLanguage,
  initialAllowReplay,
}) {
  const classes = useStyles();
  const [language, setLanguage] = useState(initialLanguage);
  const [lowerBound, setLowerBound] = useState(initialLowerBound);
  const [upperBound, setUpperBound] = useState(initialUpperBound);
  const [rounds, setRounds] = useState(initialRounds);
  const [allowReplay, setAllowReplay] = useState(initialAllowReplay);

  const handleLanguageChange = (e, value) => {
    if (value && value.code) {
      setLanguage(value);
      return;
    }
    setLanguage(null);
  };

  const handleLowerBoundChange = (e) => {
    const updatedValue = parseInt(e.target.value, 10);
    if (updatedValue < 0) {
      setLowerBound(0);
      return;
    }
    if (updatedValue > 10 ** 9) {
      setLowerBound(10 ** 9);
      return;
    }
    setLowerBound(updatedValue);
  };

  const handleLowerBoundBlur = () => {
    if (lowerBound >= upperBound) {
      setLowerBound(upperBound - 1);
    }
  };

  const handleUpperBoundChange = (e) => {
    const updatedValue = parseInt(e.target.value, 10);
    if (updatedValue < 0) {
      setUpperBound(0);
      return;
    }
    if (updatedValue > 10 ** 9) {
      setUpperBound(10 ** 9);
      return;
    }
    setUpperBound(updatedValue);
  };

  const handleUpperBoundBlur = () => {
    if (upperBound <= lowerBound) {
      setUpperBound(lowerBound + 1);
    }
  };

  const handleRoundsChange = (e) => {
    setRounds(parseInt(e.target.value, 10));
  };

  const handleAllowReplayChange = () => {
    setAllowReplay(!allowReplay);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitHandler({
      language,
      lowerBound,
      upperBound,
      rounds,
      allowReplay,
    });
  };
  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Autocomplete
            id="choose-language"
            autoHighlight
            options={LANGUAGES}
            value={language}
            getOptionLabel={(option) => option.name}
            disablePortal
            onChange={handleLanguageChange}
            renderInput={(params) => (
              <TextField
                /* eslint-disable-next-line react/jsx-props-no-spreading */
                {...params}
                required
                autoComplete="off"
                label="Choose target language"
                variant="outlined"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            variant="outlined"
            autoComplete="off"
            required
            value={lowerBound}
            fullWidth
            name="lowerbound"
            label="Lower Bound"
            defaultValue={lowerBound}
            onBlur={handleLowerBoundBlur}
            onChange={handleLowerBoundChange}
            type="text"
            id="lower-bound"
            InputProps={{
              inputComponent: NumberFormatCustom,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            variant="outlined"
            autoComplete="off"
            value={upperBound}
            fullWidth
            name="upperbound"
            onBlur={handleUpperBoundBlur}
            onChange={handleUpperBoundChange}
            label="Upper Bound"
            defaultValue={upperBound}
            type="text"
            id="upper-bound"
            required
            InputProps={{
              inputComponent: NumberFormatCustom,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <FormLabel component="legend">Number of Quiz Questions</FormLabel>
          <RadioGroup
            row
            name="rounds"
            value={rounds}
            onChange={handleRoundsChange}
          >
            {ROUNDS.map((round) => (
              <FormControlLabel
                key={`${round}`}
                value={round}
                control={<Radio />}
                label={round}
              />
            ))}
          </RadioGroup>
        </Grid>
        <Grid item xs={12}>
          <FormLabel component="legend">Allow audio replay</FormLabel>
          <RadioGroup
            row
            name="allowReplay"
            value={allowReplay}
            onChange={handleAllowReplayChange}
          >
            <FormControlLabel
              checked={allowReplay}
              control={<Radio />}
              label="Yes"
            />
            <FormControlLabel
              checked={!allowReplay}
              control={<Radio />}
              label="No"
            />
          </RadioGroup>
        </Grid>
      </Grid>
      <Button
        size="large"
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        Start
      </Button>
    </form>
  );
}

Options.propTypes = {
  submitHandler: PropTypes.func.isRequired,
  initialLanguage: PropTypes.oneOf(LANGUAGES),
  initialLowerBound: PropTypes.number,
  initialUpperBound: PropTypes.number,
  initialRounds: PropTypes.oneOf(ROUNDS),
  initialAllowReplay: PropTypes.bool,
};

Options.defaultProps = {
  initialLanguage: null,
  initialLowerBound: 0,
  initialUpperBound: 100,
  initialRounds: 5,
  initialAllowReplay: false,
};
