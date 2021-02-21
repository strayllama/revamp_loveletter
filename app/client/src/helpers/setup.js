const Deck = require('../models/deck.js')
const Player = require('../models/player.js')

const SetUpHelper = {}

SetUpHelper.setUpDeck = function (onComplete) {
  const deck = new Deck();
  deck.getDeckData(() => {
    deck.formDeck();
    deck.shuffleDeck();
    onComplete(deck);
  })
}


SetUpHelper.setUpPlayers = function (deck, gameView) {
  const player1 = new Player(gameView.getPlayerName(1), 1);
  const player2 = new Player(gameView.getPlayerName(2), 2);
  const player3 = new Player(gameView.getPlayerName(3), 3);
  const player4 = new Player(gameView.getPlayerName(4), 4);
  player3.aliveStatus = false;
  player4.aliveStatus = false;

  player1.card = deck.drawCard();
  player2.card = deck.drawCard();
  player3.card = deck.drawCard();
  player4.card = deck.drawCard();
  return [player1, player2, player3, player4];
}


module.exports = SetUpHelper
