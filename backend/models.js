const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const gameSchema = new Schema({
  deck: [Number], 
  table: [Number],
});

gameSchema.methods.replaceCards = function(cards) {
  for(let i = 0; i < this.table.length; i++) {
    if (cards.includes(this.table[i])) {
      this.table.splice(i, 1, this.deck.shift());
    }
  }
  this.save();
}

const Game = mongoose.model('Game', gameSchema);
module.exports = { Game };
