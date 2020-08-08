import React, { useEffect, useState } from "react";

function Info(props) {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setDuration(Date.now() - props.startTime),
      1000
    );
    return () => clearInterval(interval);
  }, [props.startTime]);

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
      <p>Game Duration: {Math.floor(duration / 1000)} s</p>
      <p>High Scores:</p>
      <ol>
        {props.highScores.map((s, i) => (
          <li key={i}>{Math.floor(s / 1000)} s</li>
        ))}
      </ol>
      <button onClick={props.solve}>Solve</button>
    </div>
  );
}

export default Info;
