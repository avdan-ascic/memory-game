import { useEffect, useState } from "react";
import "../assets/styles/Game.css";
import SingleCard from "./SingleCard";
import PlayerInput from "./PlayerInput";
import Scoreboard from "./ScoreBoard";
import { cardImages } from "../helpers/Helpers";

const Game = () => {
  const [cards, setCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [level, setLevel] = useState(1);
  const [endGame, setEndGame] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [scores, setScores] = useState(generateInitialScores(10));

  function generateInitialScores(numEntries) {
    const initialScores = [];
    for (let i = 0; i < numEntries; i++) {
      initialScores.push({ name: "Unknown ", moves: 0 });
    }
    return initialScores;
  }

  useEffect(() => {
    const savedScores = localStorage.getItem("scores");
    if (savedScores) {
      setScores(JSON.parse(savedScores));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("scores", JSON.stringify(scores));
  }, [scores]);

  const addPlayerName = (name) => {
    const date = new Date();
    const newScore = {
      name,
      moves,
      date: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
    };

    const curScores = [...scores];
    let added = false;

    for (let i = 0; i < 10; i++) {
      if (curScores[i].moves === 0) {
        curScores[i] = newScore;
        added = true;
        break;
      } else if (moves < curScores[i].moves) {
        curScores.splice(i, 0, newScore);
        curScores.pop();
        added = true;
        break;
      }
    }

    if (added) {
      setScores(curScores);
    }
  };

  const levelsData = [
    { numCards: 4, numMatches: 2 },
    { numCards: 16, numMatches: 8 },
    { numCards: 36, numMatches: 18 },
    { numCards: 64, numMatches: 32 },
  ];

  const { numCards, numMatches } = levelsData[level - 1];

  const shuffleCards = () => {
    const randomCards = cardImages
      .sort(() => Math.random() - 0.5)
      .slice(0, numMatches);
    const shuffledCards = [...randomCards, ...randomCards]
      .sort(() => Math.random() - 0.5)
      .slice(0, numCards)
      .map((card) => ({ ...card, id: Math.random() }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    // setMoves(0);
  };

  useEffect(() => {
    shuffleCards();
  }, [level]);

  const handleChoice = (card) => {
    if (disabled || card.matched) {
      return;
    }
    if (card === choiceOne) {
      return;
    }
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        resetMoves();
        if (cards.filter((card) => !card.matched).length === 2) {
          if (level === levelsData.length) {
            setTimeout(() => setEndGame(true), 1000);
            const hasZeroMoves = scores.some((n) => n.moves === 0);
            const hasHigherMoves = scores.some((n) => moves < n.moves);

            if (hasZeroMoves || hasHigherMoves) {
              setTimeout(() => setShowModal(true), 2000);
            }
          } else {
            setTimeout(() => setLevel((prevLevel) => prevLevel + 1), 1000);
          }
        }
      } else {
        setTimeout(() => resetMoves(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  const resetMoves = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setMoves((prevMoves) => prevMoves + 1);
    setDisabled(false);
  };

  const newGamge = () => {
    setMoves(0);
    setLevel(1);
    setEndGame(false);
  };

  return (
    <div className="game">
      {showModal && (
        <PlayerInput onAddPlayer={addPlayerName} setShowModal={setShowModal} />
      )}
      <h1>Memory Game</h1>
      {endGame && <button onClick={newGamge}>START NEW GAME</button>}
      <div className="stats">
        <p>MOVES: {moves}</p>
        <p>LEVEL: {level}</p>
      </div>
      <div className={`card-grid level-${level}`}>
        {cards.map((card) => (
          <SingleCard
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
          />
        ))}
      </div>
      {endGame && (
        <div className="message">
          <p>"Congratulation, You found all matches in just {moves} moves!"</p>
        </div>
      )}
      <Scoreboard scores={scores} setShowModal={setShowModal} />
    </div>
  );
};

export default Game;
