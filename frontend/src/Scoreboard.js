import React from "react";

function Scoreboard(props) {
  return (
    <div id="scoreboard">
      <h1>Scoreboard</h1>
      {props.players.map((player, index) => {
        return (
          <p
            key={index}
            style={{ fontWeight: player.name === props.name ? "bold" : "" }}
          >
            {player.name} <span style={{ float: "right" }}>{player.score}</span>
          </p>
        );
      })}
    </div>
  );
}

export default Scoreboard;
