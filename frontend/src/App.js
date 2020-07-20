import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import './App.css';

const ENDPOINT = 'http://127.0.0.1:4000';

function App() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("initialize", data => setCards(data.cards));
    return () => socket.disconnect();
  }, []);

  const numbers = ["one", "two", "three", "four", "five", "six", "seven"];


  function handleClick() {
    console.log("ahh");
  }
  return (
    <div className="table">
      {cards.map((card, index) => {
        return (
          <Card key={index} value={card} number={numbers[index]} handleClick={handleClick}/>
        )
      })}
    </div>
  );
}

function Card(props) {
  const hasDots = props.value.toString(2).padStart(6, '0').split('').map(s => s === "1");
  const colors = ["red", "orange", "yellow", "green", "blue", "purple"];
  return (
    <div className="card" style={{gridArea: props.number}} onClick={props.handleClick}> {
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
