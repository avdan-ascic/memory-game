import "../assets/styles/ScoreBoard.css"


const Scoreboard = ({ scores }) => {
    const topPlayers = scores.sort((a, b) => a.moves - b.moves).slice(0, 10);
 
  
    return (
      <div className="scoreboard">
        <h2>TOP 10 PLAYERS:</h2>
        <ol>
          {topPlayers.map((player, index) => (
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
  
  
  