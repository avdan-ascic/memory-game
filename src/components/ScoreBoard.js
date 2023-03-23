import "../assets/styles/ScoreBoard.css";

const Scoreboard = ({ scores }) => {
  return (
    <div className="scoreboard">
      <h2>TOP 10 PLAYERS:</h2>
      <ol>
        {scores.map((player, index) => (
          <li key={index}>
            <div className="scoreboard-list">
              <div> {player.name}</div>
              <div>{player.moves}</div>
              <div>{player.date}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Scoreboard;
