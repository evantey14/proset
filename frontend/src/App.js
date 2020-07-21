import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import './App.css';

const ENDPOINT = 'http://127.0.0.1:4000';

function App() {
  const [socket, setSocket] = useState();
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const locations = ["one", "two", "three", "four", "five", "six", "seven"];

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    setSocket(socket);
    socket.on("initialize", data => {
      setSelectedCards([]);
      setCards(data.cards);
    });
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [cards, selectedCards]);

  function handleClick(card) {
    let newSelectedCards;
    if (selectedCards.includes(card)) {
      newSelectedCards = selectedCards.filter(c => c !== card);
    } else {
      newSelectedCards = [...selectedCards, card];
    }
    if (newSelectedCards.length > 0) {
      socket.emit("guess", newSelectedCards);
    }
    setSelectedCards(newSelectedCards);
  }

  function handleKey({ key }) {
    if (cards[key - 1]) {
      handleClick(cards[key - 1]);
    }
  }

  function solve() {
    for (let i = 1; i <127; i++) {
      const includeCards = i.toString(2).padStart(7, '0').split('').map(s => s === "1");
      let guess = cards.filter((c, index) => includeCards[index]);
      if (!guess.includes(0) && guess.reduce((acc, cur) => acc^cur) === 0) {
        const solution = locations.reduce((a, l, i) => includeCards[i] ? a + " " + l : a, "");
        console.log(solution);
        break;
      }
    }
  }

  return (
    <React.Fragment>
    <div className="table">
      {cards.map((card, index) => {
        if (card !== 0) {
          return (
            <Card
              key={card /* This makes React re-animate when card is replaced. */}
              value={card}
              location={locations[index]}
              selected={selectedCards.includes(card)}
              handleClick={() => handleClick(card)}
            />
          )
        }
      })}
    </div>
    <button onClick={solve}>Solve</button>
    </React.Fragment>
  );
}

function Card(props) {
  const hasDots = props.value.toString(2).padStart(6, '0').split('').map(s => s === "1");
  const colors = ["red", "orange", "yellow", "green", "blue", "purple"];

  return (
    <div
      className={`card ${props.selected ? "selected" : ""}`}
      style={{gridArea: props.location}}
      onClick={props.handleClick}
    > {
      hasDots.map((hasDot, index) => {
        if (hasDot) {
          return <Dot key={index} color={colors[index]} />;
        }
      })
    } </div>
  )
}

function Dot(props) {
  return <div className={`dot ${props.color}`}></div>
}
export default App;
