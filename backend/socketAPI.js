const socketIo = require("socket.io");
const { Game } = require("./models");

const io = socketIo();
const socketAPI = {};

const isASet = (cards) => cards.reduce((acc, cur) => acc ^ cur) === 0;

io.on("connection", async (socket) => {
  console.log("Client connected");

  const game = await Game.findOne({}); // for now, there's just one global game
  const name = await game.addPlayer();
  socket.emit("setName", { name: name });
  io.emit("refreshGame", { cards: game.table, players: game.players });

  socket.on("guess", async (cards) => {
    let game = await Game.findOne({});
    if (isASet(cards)) {
      await game.updateGame(name, cards);
      console.log(
        `${name} found a set: ${cards} (${game.deck.length} remaining in the deck.)`
      );
      if (game.isOver()) {
        Game.deleteMany({}, (e) => console.log(e));
        game = await Game.createNewGame(game.players);
      }
      io.emit("refreshGame", { cards: game.table, players: game.players }); // TODO this should be fixed
    }
  });

  socket.on("disconnect", async () => {
    const game = await Game.findOne({});
    console.log("Client disconnected");
    game.removePlayer(name);
    io.emit("refreshGame", { cards: game.table, players: game.players });
  });
});

socketAPI.io = io;
module.exports = socketAPI;
