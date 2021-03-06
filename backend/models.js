const mongoose = require("mongoose");
const desserts = require("./desserts");

const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  score: Number,
});

const gameSchema = new Schema({
  deck: [Number],
  table: [Number],
  players: [userSchema],
  startTime: { type: Date, default: Date.now },
  duration: Number,
});

const shuffle = (cards) => cards.sort(() => Math.random() - 0.5);

gameSchema.statics.createNewGame = function (players = []) {
  const deck = shuffle([...Array(64).keys()].filter((c) => c !== 0));
  const table = deck.splice(0, 7);
  return this.create({ deck, table, players });
};

gameSchema.statics.findMostRecent = function () {
  return this.findOne().sort("-startTime");
};

gameSchema.statics.getHighScores = async function () {
  const games = await this.find({}).exec();
  const highScores = games
    .filter((g) => g.duration)
    .map((g) => g.duration)
    .sort((a, b) => a - b);
  return highScores;
};

gameSchema.methods.updateGame = function (name, cardsToRemove) {
  for (let i = 0; i < this.table.length; i++) {
    if (cardsToRemove.includes(this.table[i])) {
      const replacementCard = this.deck.length > 0 ? this.deck.shift() : 0;
      this.table.splice(i, 1, replacementCard);
    }
  }

  for (let i = 0; i < this.players.length; i++) {
    if (this.players[i].name === name) {
      this.players[i].score += cardsToRemove.length;
    }
  }

  return this.save();
};

gameSchema.methods.isOver = function () {
  return this.table.every((c) => c === 0);
};

gameSchema.methods.end = function (cb) {
  this.duration = Date.now() - this.startTime;
  this.save(cb);
};

gameSchema.methods.addPlayer = function () {
  const name = desserts[Math.floor(Math.random() * desserts.length)];
  this.players.push({ name: name, score: 0 });
  this.save();
  return name;
};

gameSchema.methods.removePlayer = function (name) {
  for (let i = 0; i < this.players.length; i++) {
    if (this.players[i].name === name) {
      this.players[i].remove();
    }
  }
  this.save();
};

const Game = mongoose.model("Game", gameSchema);
module.exports = { Game };
