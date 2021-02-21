const DeckRequest = require('../services/request.js');

const Deck = function() {
  this.apiDeckInfo = {};
  this.cardDeck = [];
  this.counter = 0;
  this.noCardsLeft = false;
  this.cardActions = [];
  this.initialRemovedCard = null;

  const guard = function (holderPlayer, gameView, playerArray, endOfGoFunctions) {
    gameView.askForPlayerChoiceGuard(holderPlayer, playerArray, endOfGoFunctions);
  }

  const priest = function (holderPlayer, gameView, playerArray, endOfGoFunctions) {
    gameView.askForPlayerChoicePriest(holderPlayer, playerArray, endOfGoFunctions);
  }

  const baron = function (holderPlayer, gameView, playerArray, endOfGoFunctions) {
    gameView.askForPlayerChoiceBaron(holderPlayer, playerArray, endOfGoFunctions);
  }

  const handmaid = function (holderPlayer, gameView, playerArray, endOfGoFunctions) {
    gameView.askForPlayerChoiceHandmaid(holderPlayer, playerArray, endOfGoFunctions);
  }

  const prince = function (holderPlayer, gameView, playerArray, endOfGoFunctions, deck) {
    gameView.askForPlayerChoicePrince(holderPlayer, playerArray, endOfGoFunctions, deck);
  }

  const king = function (holderPlayer, gameView, playerArray, endOfGoFunctions) {
    gameView.askForPlayerChoiceKing(holderPlayer, playerArray, endOfGoFunctions);
  }

  const countess = function (holderPlayer, gameView, playerArray, endOfGoFunctions) {
    gameView.askForPlayerChoiceCountess(holderPlayer, playerArray, endOfGoFunctions);
  }

  const princess = function (holderPlayer, gameView, playerArray, endOfGoFunctions) {
    gameView.askForPlayerChoicePrincess(holderPlayer, playerArray, endOfGoFunctions);
  }

  this.cardActions.push(guard);
  this.cardActions.push(priest);
  this.cardActions.push(baron);
  this.cardActions.push(handmaid);
  this.cardActions.push(prince);
  this.cardActions.push(king);
  this.cardActions.push(countess);
  this.cardActions.push(princess);
} // end Deck constructor


Deck.prototype.getDeckData = function (gotCardData) {
  const deckRequest = new DeckRequest('http://localhost:3000/data4players');

  const getDataRequestComplete = ((cardData) => {
    cardData.forEach((card) => {
      this.apiDeckInfo[card.character] = card;
    });
    gotCardData();
  }) // end getDataRequestComplete callback function

  deckRequest.get(getDataRequestComplete);
}


Deck.prototype.formDeck = function(){
  for (let i = 1; i < 6; i++){
    this.cardDeck.push(this.apiDeckInfo.Guard);
  }
  for (let i = 1; i < 3; i++){
    this.cardDeck.push(this.apiDeckInfo.Priest); //priest
    this.cardDeck.push(this.apiDeckInfo.Baron); // baron
    this.cardDeck.push(this.apiDeckInfo.Handmaid);
    this.cardDeck.push(this.apiDeckInfo.Prince);
  }
  this.cardDeck.push(this.apiDeckInfo.King);
  this.cardDeck.push(this.apiDeckInfo.Countess);
  this.cardDeck.push(this.apiDeckInfo.Princess);
}


Deck.prototype.shuffleDeck = function () {
  let currentIndex =  this.cardDeck.length;
  let temporaryValue = 0;
  let randomIndex = 0;
  while (0!== currentIndex) {
    randomIndex = Math.floor(Math.random()*currentIndex);
    currentIndex -= 1;
    temporaryValue = this.cardDeck[currentIndex];
    this.cardDeck[currentIndex] = this.cardDeck[randomIndex];
    this.cardDeck[randomIndex] = temporaryValue;
  }
}


Deck.prototype.drawCard = function () {
  const cardToReturn = this.cardDeck[this.counter]
  this.counter += 1;
  if(this.counter === this.cardDeck.length) {
    this.noCardsLeft = true;
  }
  return cardToReturn;
}


Deck.prototype.removeInitialCard = function() {
  this.initialRemovedCard = this.drawCard();
}


module.exports = Deck;
