import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import './App.css';

const ENDPOINT = 'http://127.0.0.1:4000';

function App() {

  const [cards, setCards] = useState([]);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("initialize", data => {
      console.log(data);
      setCards(data.cards);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="App">
      {cards.map((card, index) => {
        return (
          <Card key={index} number={card} />
        )
      })}
    </div>
  );
}

function Card(props) {
  const hasDots = props.number.toString(2).padStart(6, '0').split('').map(s => s === "1");
  const colors = ["red", "orange", "yellow", "green", "blue", "violet"];
  return (
    <div class="card"> { 
      hasDots.map((hasDot, index) => {
        if (hasDot) {
          return <Dot color={colors[index]} />;
        }
      })
    } </div>
  )
}

function Dot(props) {
  return <div class={`dot ${props.color}`}></div>
}
export default App;
