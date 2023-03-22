import { useEffect, useState } from "react";
import "../assets/styles/Game.css";
import androidImg from "../assets/images/android.png";
import angularImg from "../assets/images/angular.png";
import csharpImg from "../assets/images/c#.png";
import cssImg from "../assets/images/css.png";
import dockerImg from "../assets/images/docker.png";
import drupalImg from "../assets/images/drupal.png";
import gitImg from "../assets/images/git.png";
import githubImg from "../assets/images/github.png";
import goImg from "../assets/images/go.png";
import herokuImg from "../assets/images/heroku.png";
import htmlImg from "../assets/images/html.png";
import javaImg from "../assets/images/java.png";
import javascriptImg from "../assets/images/javascript.png";
import linuxImg from "../assets/images/linux.png";
import mochaImg from "../assets/images/mocha.png";
import mongoImg from "../assets/images/mongo.png";
import msteamsImg from "../assets/images/msteams.png";
import mysqlImg from "../assets/images/mysql.png";
import nodeImg from "../assets/images/node.png";
import paragonImg from "../assets/images/paragon.png";
import postgresqlImg from "../assets/images/postgresql.png";
import postmanImg from "../assets/images/postman.png";
import pythonImg from "../assets/images/python.png";
import railImg from "../assets/images/rail.png";
import reactImg from "../assets/images/react.png";
import scalaImg from "../assets/images/scala.png";
import slackImg from "../assets/images/slack.png";
import swiftImg from "../assets/images/swift.png";
import typescriptImg from "../assets/images/typescript.png";
import unityImg from "../assets/images/unity.png";
import visualstudioImg from "../assets/images/visualstudio.png";
import vueImg from "../assets/images/vue.png";
import SingleCard from "./SingleCard";
import PlayerInput from "./PlayerInput";
import Scoreboard from "./ScoreBoard";

const cardImages = [
  { src: androidImg, matched: false },
  { src: angularImg, matched: false },
  { src: csharpImg, matched: false },
  { src: cssImg, matched: false },
  { src: dockerImg, matched: false },
  { src: drupalImg, matched: false },
  { src: gitImg, matched: false },
  { src: githubImg, matched: false },
  { src: herokuImg, matched: false },
  { src: htmlImg, matched: false },
  { src: goImg, matched: false },
  { src: javaImg, matched: false },
  { src: javascriptImg, matched: false },
  { src: linuxImg, matched: false },
  { src: mochaImg, matched: false },
  { src: mongoImg, matched: false },
  { src: msteamsImg, matched: false },
  { src: mysqlImg, matched: false },
  { src: nodeImg, matched: false },
  { src: paragonImg, matched: false },
  { src: postgresqlImg, matched: false },
  { src: postmanImg, matched: false },
  { src: pythonImg, matched: false },
  { src: railImg, matched: false },
  { src: reactImg, matched: false },
  { src: scalaImg, matched: false },
  { src: slackImg, matched: false },
  { src: swiftImg, matched: false },
  { src: typescriptImg, matched: false },
  { src: unityImg, matched: false },
  { src: visualstudioImg, matched: false },
  { src: vueImg, matched: false },
];

const Game = () => {
  const [cards, setCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [level, setLevel] = useState(1);
  const [endGame, setEndGame] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [scores, setScores] = useState([])


   useEffect(() => {
    const savedScores = localStorage.getItem('scores');
    if (savedScores) {
      setScores(JSON.parse(savedScores));
    }
  }, []);

  
  useEffect(() => {
    localStorage.setItem('scores', JSON.stringify(scores));
  }, [scores]);

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

  const newGamge = () => {
    setMoves(0);
    setLevel(1);
    setEndGame(false);
  };

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

  useEffect(() => {
    shuffleCards();
  }, [level]);

  
  const addPlayerName = (name) => {
    const date = new Date();
    const newScore = {
      name,
      moves,
      date: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
    };
    setScores([...scores, newScore]);
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
      <Scoreboard scores={scores} setShowModal={setShowModal}/>
    </div>
  );
};

export default Game;
