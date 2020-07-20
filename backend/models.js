const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const gameSchema = new Schema({
  deck: [Number], 
  table: [Number],
});

const Game = mongoose.model('Game', gameSchema);
module.exports = { Game };
