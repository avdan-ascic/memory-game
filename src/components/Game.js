import { useEffect, useState } from "react";
import "../assets/styles/Game.css";
import SingleCard from "./SingleCard";
import PlayerInput from "./PlayerInput";
import Scoreboard from "./ScoreBoard";
import { cardImages } from "../helpers/CardImages";

const Game = () => {
  const [cards, setCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [level, setLevel] = useState(1);
  const [endGame, setEndGame] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [scores, setScores] = useState([
    { name: "Unknown ", moves: 0 },
    { name: "Unknown ", moves: 0 },
    { name: "Unknown ", moves: 0 },
    { name: "Unknown ", moves: 0 },
    { name: "Unknown ", moves: 0 },
    { name: "Unknown ", moves: 0 },
    { name: "Unknown ", moves: 0 },
    { name: "Unknown ", moves: 0 },
    { name: "Unknown ", moves: 0 },
    { name: "Unknown ", moves: 0 },
  ]);

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

    const sortedScores = [...scores, newScore]
      .sort((a, b) => b.moves - a.moves)
      .slice(0, 10);
    setScores(sortedScores);
  };

  const shuffleCards = () => {
    let numCards = 0;
    let numMatches = 0;
    switch (level) {
      case 1:
        numCards = 4;
        numMatches = 2;
        break;
      case 2:
        numCards = 16;
        numMatches = 8;
        break;
      case 3:
        numCards = 36;
        numMatches = 18;
        break;
      case 4:
        numCards = 64;
        numMatches = 32;
        break;
      default:
        numCards = 4;
        numMatches = 2;
        break;
    }

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
    if (disabled) {
      return;
    }
    if (card === choiceOne) {
      return;
    }
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);

    const numUnmatchedCards = cards.filter((card) => !card.matched).length - 2;
    if (numUnmatchedCards === 0) {
      if (level === 4) {
        setEndGame(true);
        setTimeout(() => setShowModal(true), 2000);
      } else {
        setLevel((prevLevel) => prevLevel + 1);
      }
    }
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
        console.log("match");
        resetMoves();
      } else {
        console.log("not match");
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
