const { Game } = require('./models')
var socketIo = require('socket.io')
var io = socketIo();
var socketAPI = {};

const isASet = cards => cards.reduce((acc, cur) => acc ^ cur) === 0;

io.on('connection', async (socket) => {
  console.log('Client connected');

  let game = await Game.findOne({}); // For now, there's just one game
  socket.emit('initialize', {cards: game.table});

  socket.on('guess', cards => {
    if (isASet(cards)) {
      game.replaceCards(cards);
      io.emit('initialize', {cards: game.table}); // TODO this should be fixed
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

socketAPI.io = io;
module.exports = socketAPI;
