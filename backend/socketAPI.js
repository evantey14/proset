const socketIo = require("socket.io");
const { Game } = require("./models");

const io = socketIo();
const socketAPI = {};

const isASet = (cards) => cards.reduce((acc, cur) => acc ^ cur) === 0;

io.on("connection", async (socket) => {
  console.log("Client connected");

  const game = await Game.findOne({}); // for now, there's just one global game
  const name = `Player ${Math.floor(100 * Math.random())}`;
  await game.addPlayer(name);
  socket.emit("setName", { name: name });
  io.emit("initialize", { cards: game.table, players: game.players });

  socket.on("guess", async (cards) => {
    const game = await Game.findOne({});
    if (isASet(cards)) {
      await game.updateGame(name, cards);
      console.log(`Set: ${cards}`);
      console.log(`Table: ${game.table} Remaining: ${game.deck}`);
      if (game.isOver()) {
        game = await Game.createNewGame();
      }
      io.emit("initialize", { cards: game.table, players: game.players }); // TODO this should be fixed
    }
  });

  socket.on("disconnect", async () => {
    const game = await Game.findOne({});
    console.log("Client disconnected");
    game.removePlayer(name);
    io.emit("initialize", { cards: game.table, players: game.players });
  });
});

socketAPI.io = io;
module.exports = socketAPI;
