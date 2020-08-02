import React from "react";

function Card(props) {
  const hasDots = props.value
    .toString(2)
    .padStart(6, "0")
    .split("")
    .map((s) => s === "1");
  const colors = ["red", "orange", "yellow", "green", "blue", "purple"];

  return (
    <div
      className={`card ${props.selected ? "selected" : ""}`}
      style={{ gridArea: props.location }}
      onClick={props.handleClick}
    >
      {" "}
      {hasDots.map((hasDot, index) => {
        if (hasDot) {
          return <Dot key={index} color={colors[index]} />;
        }
      })}{" "}
    </div>
  );
}

function Dot(props) {
  return <div className={`dot ${props.color}`}></div>;
}

export default Card;
