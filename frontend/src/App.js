import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import "./App.css";

import Card from "./Card";
import Info from "./Info";
import Scoreboard from "./Scoreboard";
import { positions } from "./constants";
import { comparePlayers, findSet, togglePresence } from "./helpers";

// const ENDPOINT = "http://127.0.0.1:4000";
const ENDPOINT = "http://1b66209e0eba.ngrok.io/";

function App() {
  const [socket, setSocket] = useState();
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    setSocket(socket);
    socket.on("refreshGame", (data) => {
      setSelectedCards([]);
      setCards(data.cards);
      setPlayers(data.players.sort(comparePlayers));
    });
    socket.on("setName", (data) => setName(data.name));
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [cards, selectedCards]);

  function handleClick(card) {
    let newSelectedCards = togglePresence(selectedCards, card);
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

  async function solve() {
    const solution = await findSet(cards);
    setSelectedCards(solution);
    setTimeout(() => socket.emit("guess", solution), 1000);
  }

  return (
    <React.Fragment>
      <Info solve={solve} />
      <div id="table">
        {cards.map((card, index) => {
          if (card !== 0) {
            return (
              <Card
                key={
                  card /* This makes React re-animate when card is replaced. */
                }
                value={card}
                position={positions[index]}
                selected={selectedCards.includes(card)}
                handleClick={() => handleClick(card)}
              />
            );
          }
        })}
      </div>
      <Scoreboard players={players} name={name} />
    </React.Fragment>
  );
}

export default App;
