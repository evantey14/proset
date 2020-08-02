import React from "react";

import { colors } from "./constants";
import { intToBinaryArray } from "./helpers";

function Card(props) {
  const dotsPresent = intToBinaryArray(props.value, 6);
  return (
    <div
      className={`card ${props.selected ? "selected" : ""}`}
      style={{ gridArea: props.position }}
      onClick={props.handleClick}
    >
      {" "}
      {dotsPresent.map((dotPresent, index) => {
        if (dotPresent) {
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
