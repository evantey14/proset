const socketIo = require("socket.io");
const { Game } = require("./models");

const io = socketIo();
const socketAPI = {};

const isASet = (cards) => cards.reduce((acc, cur) => acc ^ cur) === 0;

io.on("connection", async (socket) => {
  console.log("Client connected");
  const highScores = await Game.getHighScores();

  const game = await Game.findMostRecent();
  const name = await game.addPlayer();
  socket.emit("initialize", { name: name, highScores: highScores });
  // startTime doesn't need to be sent every refreshGame...but oh well.
  io.emit("refreshGame", {
    cards: game.table,
    players: game.players,
    startTime: game.startTime,
  });

  socket.on("guess", async (cards) => {
    let game = await Game.findMostRecent();
    if (isASet(cards)) {
      game = await game.updateGame(name, cards);
      console.log(
        `${name} found a set: ${cards} (${game.deck.length} remaining.)`
      );
      if (game.isOver()) {
        await game.end(async () => {
          io.emit("refreshHighScores", {
            highScores: await Game.getHighScores(),
          });
        });
        game = await Game.createNewGame(game.players);
      }
      io.emit("refreshGame", {
        cards: game.table,
        players: game.players,
        startTime: game.startTime,
      });
    }
  });

  socket.on("disconnect", async () => {
    const game = await Game.findMostRecent();
    console.log("Client disconnected");
    game.removePlayer(name);
    io.emit("refreshGame", {
      cards: game.table,
      players: game.players,
      startTIme: game.startTime,
    });
  });
});

socketAPI.io = io;
module.exports = socketAPI;
