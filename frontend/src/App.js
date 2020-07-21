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

  return (
    <div className="table">
      {cards.map((card, index) => {
        return (
          <Card
            key={card /* This makes React re-animate when card is replaced. */}
            value={card}
            location={locations[index]}
            selected={selectedCards.includes(card)}
            handleClick={() => handleClick(card)}
          />
        )
      })}
    </div>
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
