const { Game } = require('./models')
var socketIo = require('socket.io')
var io = socketIo();
var socketAPI = {};

io.on('connection', socket => {
  console.log('Client connected');

  Game.findOne({}).then((game) => {
    console.log(game);
    socket.emit('initialize', {cards: game.table});
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

socketAPI.io = io;
module.exports = socketAPI;
