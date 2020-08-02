import React from "react";

function Info(props) {
  return (
    <div id="info">
      <h1>Pro Set</h1>
      <p>
        <u>Goal</u>: Find a set of cards with an even number of each color dot.
      </p>
      <p>
        <a href="https://github.com/evantey14/proset">source</a> |{" "}
        <a href="https://github.com/evantey14">@evantey14</a>
      </p>
      <button onClick={props.solve}>Solve</button>
    </div>
  );
}

export default Info;
