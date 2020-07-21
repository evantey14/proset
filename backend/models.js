const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const gameSchema = new Schema({
  deck: [Number], 
  table: [Number],
});


const shuffle = cards => cards.sort(() => Math.random() - 0.5);
gameSchema.statics.createNewGame = function() {
  let deck = shuffle([...Array(64).keys()].filter(c => c !== 0));
  const table = deck.splice(0, 7);
  return this.create({deck: deck, table: table});
}

gameSchema.methods.replaceCards = function(cards) {
  for(let i = 0; i < this.table.length; i++) {
    if (cards.includes(this.table[i])) {
      const replacementCard = this.deck.length > 0 ? this.deck.shift() : 0;
      this.table.splice(i, 1, replacementCard);
    }
  }
  this.save();
}

gameSchema.methods.isOver = function() {
  return this.table.every(c => c === 0);
}

const Game = mongoose.model('Game', gameSchema);
module.exports = { Game };
