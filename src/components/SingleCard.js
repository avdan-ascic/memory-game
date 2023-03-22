import "../assets/styles/SingleCard.css";

const SingleCard = ({ card, handleChoice, flipped, disabled }) => {
  const handleClick = () => {
    if(!disabled){
      handleChoice(card);
    }
   
  };
  

  return (
    <div className="container">
      <div className={`card${flipped ? " flipped" : ""}`} onClick={handleClick}>
        <div className="card__face card__face--front" />
        <div className="card__face card__face--back">
          <img src={card.src} />
        </div>
      </div>
    </div>
  );
};

export default SingleCard;
