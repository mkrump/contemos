import React, { useEffect } from "react";
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

const registerGameReducer = (state, action) => {
  switch (action.type) {
    case "newGame":
      return {
        ...state,
        cards: null,
        n: 0,
        score: 0,
      };
    case "correctAnswer":
      return {
        ...state,
        score: state.score + 1,
      };
    case "nextCard":
      return {
        ...state,
        n: state.n + 1,
      };
    case "fetching":
      return {
        ...state,
        loading: true,
      };
    case "success":
      return {
        ...state,
        cards: action.cards,
        loading: false,
      };
    case "error":
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      throw new Error(`${action} action type not supported`);
  }
};

const registerOptionsReducer = (state, action) => {
  if (action.type === "updateOptions") {
    return {
      ...state,
      language: action.language,
      lowerBound: action.lowerBound,
      upperBound: action.upperBound,
      rounds: action.rounds,
      allowReplay: action.allowReplay,
    };
  }
  throw new Error("action type not supported");
};

const initialGameState = {
  cards: null,
  n: 0,
  score: 0,
};

export default function Game() {
  const classes = useStyles();
  const [gameState, gameDispatch] = React.useReducer(
    registerGameReducer,
    initialGameState
  );
  const [optionsState, optionsDispatch] = React.useReducer(
    registerOptionsReducer,
    {}
  );

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
    [gameState.cards, gameState.n]
  );

  const createCards = (lowerBound, upperBound, language, rounds) => {
    const numbers = [...Array(rounds)].map(() =>
      randomInt(lowerBound, upperBound)
    );
    gameDispatch({ type: "fetching" });
    Promise.all(numbers.map((number) => getNumber(language.code, number)))
      .then((r) => {
        gameDispatch({ type: "success", cards: r });
      })
      .catch((error) => gameDispatch({ type: "error", error }));
  };

  const updateOptions = ({
    language,
    lowerBound,
    upperBound,
    rounds,
    allowReplay,
  }) => {
    optionsDispatch({
      type: "updateOptions",
      language,
      lowerBound,
      upperBound,
      rounds,
      allowReplay,
    });
    createCards(lowerBound, upperBound, language, rounds);
  };

  const nextCard = (correct) => {
    if (correct) {
      gameDispatch({ type: "correctAnswer" });
    }
    gameDispatch({ type: "nextCard" });
  };

  const getCurrentState = () => {
    if (gameState.cards && gameState.n >= gameState.cards.length) {
      return "GAME_OVER";
    }
    if (gameState.loading === true) {
      return "LOADING";
    }
    if (gameState.cards === null) {
      return "NEW_GAME";
    }
    return "PLAYING";
  };

  const renderCurrentState = (status) => {
    const { cards, n, score } = gameState;
    const {
      language,
      lowerBound,
      upperBound,
      allowReplay,
      rounds,
    } = optionsState;
    const { number, url } =
      // eslint-disable-next-line security/detect-object-injection
      cards && cards[n] ? cards[n] : { number: "", url: "" };
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
          <Again onClickHandler={() => gameDispatch({ type: "newGame" })} />
        </>
      ),
    }[status];
  };

  return (
    <div className={classes.game}>{renderCurrentState(getCurrentState())}</div>
  );
}
