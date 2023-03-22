import Modal from "../UI/Modal";
import "../assets/styles/PlayerInput.css";
import { useState } from "react";

const PlayerInput = (props) => {
  const [input, setInput] = useState("");
  const [errorMesage, setErrorMesage] = useState(false);

  const inputHandler = (event) => {
    // console.log(event.target.value);
    setInput(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (input.trim() === "") {
      setErrorMesage(true);
      return;
    }

    setErrorMesage(false);
    props.onAddPlayer(input);
    props.setShowModal(false);

    setInput("");
  };

  return (
    <Modal>
      <div className="container">
        <p>Well done! You're in the top 10 now! Please add your name here:</p>
        <form>
          <input placeholder="Player's name" onChange={inputHandler} />
          {errorMesage && (
            <p className="error-message">Input field can not be empty!</p>
          )}
          <div className="buttons-btn">
            <button type="submit" onClick={submitHandler} value={input} className="btn-left">
              OK
            </button>
            <button onClick={() => props.setShowModal(false) } className="btn-right">CANCEL</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default PlayerInput;
