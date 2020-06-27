import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import getNumber from "../../fetch/api";

import Options from "./Options";
import Play from "./Play";
import Score from "./Score";
import Loading from "./Loading";
import Again from "./Again";

const useStyles = makeStyles(() => ({
  game: {
    maxWidth: "295px",
  },
}));

export default function Game() {
  const classes = useStyles();
  const [score, setScore] = useState(0);
  const [cards, setCards] = useState(null);
  const [n, setN] = useState(0);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({});

  const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  useEffect(
    () => () => {
      try {
        window.scroll({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      } catch (error) {
        // just a fallback for older browsers
        window.scrollTo(0, 0);
      }
    },
    [cards, n]
  );

  const createCards = (lowerBound, upperBound, language, rounds) => {
    const numbers = [...Array(rounds)].map(() =>
      randomInt(lowerBound, upperBound)
    );
    setLoading(true);
    Promise.all(numbers.map((number) => getNumber(language.code, number))).then(
      (r) => {
        setCards(r);
        setLoading(false);
      }
    );
  };

  const updateOptions = ({
    language,
    lowerBound,
    upperBound,
    rounds,
    allowReplay,
  }) => {
    setOptions({ language, lowerBound, upperBound, rounds, allowReplay });
    createCards(lowerBound, upperBound, language, rounds);
  };

  const nextCard = (correct) => {
    if (correct) {
      setScore(score + 1);
    }

    setN(n + 1);
  };

  const newGame = () => {
    setCards(null);
    setN(0);
    setScore(0);
  };

  const getCurrentState = () => {
    if (cards && n >= cards.length) {
      return "GAME_OVER";
    }
    if (loading === true) {
      return "LOADING";
    }
    if (cards === null) {
      return "NEW_GAME";
    }
    return "PLAYING";
  };

  const renderCurrentState = (status) => {
    const { number, url } =
      // eslint-disable-next-line security/detect-object-injection
      cards && cards[n] ? cards[n] : { number: "", url: "" };
    const { language, lowerBound, upperBound, allowReplay, rounds } = options;
    // eslint-disable-next-line security/detect-object-injection
    return {
      NEW_GAME: (
        <Options
          submitHandler={updateOptions}
          initialLanguage={language}
          initialLowerBound={lowerBound}
          initialUpperBound={upperBound}
          initialRounds={rounds}
          initialAllowReplay={allowReplay}
        />
      ),
      LOADING: <Loading />,
      PLAYING: (
        <>
          <Score correct={score} attempted={n} remaining={rounds - n} />
          <Play
            number={number}
            audioUrl={url}
            nextCardHandler={nextCard}
            allowAudioReplay={allowReplay}
          />
        </>
      ),
      GAME_OVER: (
        <>
          <Score correct={score} attempted={n} remaining={rounds - n} />
          <Again onClickHandler={newGame} />
        </>
      ),
    }[status];
  };

  return (
    <div className={classes.game}>{renderCurrentState(getCurrentState())}</div>
  );
}
