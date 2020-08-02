import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import "./App.css";

import Card from "./Card";

// const ENDPOINT = "http://127.0.0.1:4000";
const ENDPOINT = "http://1b66209e0eba.ngrok.io/";

function App() {
  const [socket, setSocket] = useState();
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [players, setPlayers] = useState([]);
  const [name, setName] = useState("");
  const locations = ["one", "two", "three", "four", "five", "six", "seven"];

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    setSocket(socket);
    socket.on("initialize", (data) => {
      setSelectedCards([]);
      setCards(data.cards);
      setPlayers(data.players.sort((a, b) => (a.name > b.name ? 1 : -1)));
    });
    socket.on("setName", (data) => setName(data.name));
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [cards, selectedCards]);

  function handleClick(card) {
    let newSelectedCards;
    if (selectedCards.includes(card)) {
      newSelectedCards = selectedCards.filter((c) => c !== card);
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
    for (let i = 1; i < 127; i++) {
      const includeCards = i
        .toString(2)
        .padStart(7, "0")
        .split("")
        .map((s) => s === "1");
      let guess = cards.filter((c, index) => includeCards[index]);
      if (!guess.includes(0) && guess.reduce((acc, cur) => acc ^ cur) === 0) {
        const solution = locations.reduce(
          (a, l, i) => (includeCards[i] ? a + " " + l : a),
          ""
        );
        console.log(solution);
        break;
      }
    }
  }

  return (
    <React.Fragment>
      <div id="info">
        <h1>Pro Set</h1>
        <p>
          <u>Goal</u>: Find a set of cards with an even number of each dot
          color.
        </p>
        <p>
          <a href="https://github.com/evantey14/proset">source</a> |{" "}
          <a href="https://github.com/evantey14">@evantey14</a>
        </p>
        <button onClick={solve}>Solve</button>
      </div>
      <div id="table">
        {cards.map((card, index) => {
          if (card !== 0) {
            return (
              <Card
                key={
                  card /* This makes React re-animate when card is replaced. */
                }
                value={card}
                location={locations[index]} // TODO location -> position bc it's a keyword
                selected={selectedCards.includes(card)}
                handleClick={() => handleClick(card)}
              />
            );
          }
        })}
      </div>
      <div className="scoreboard">
        <h1>Scoreboard</h1>
        {players.map((player, index) => {
          return (
            <p
              key={index}
              style={{ fontWeight: player.name === name ? "bold" : "" }}
            >
              {player.name}{" "}
              <span style={{ float: "right" }}>{player.score}</span>
            </p>
          );
        })}
      </div>
    </React.Fragment>
  );
}

export default App;
