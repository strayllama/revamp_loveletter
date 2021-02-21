const SetUpHelper = require('./helpers/setup.js');
const GameView = require('./views/game_view.js');
const Player = require('./models/player.js');
const Turn = require('./models/turn.js');

let deck;
let gameNotWon = true;
let playerArray = [];
let gameNotStarted = true;
let turnCounter = 0;
let skippedPlayer = 0;
let playerWon = null;
const gameView = new GameView();


SetUpHelper.setUpDeck((finishedDeck) => {
  deck = finishedDeck;
  deck.removeInitialCard();
});


const handleStartGameButton = function () {
  if (gameNotStarted) {
    playerArray =  SetUpHelper.setUpPlayers(deck, gameView);
    const startNoise = new Audio('./sounds/startPlaying.mp3')
    startNoise.play();
    playRound();
    gameNotStarted = false;
    const startButton = document.getElementById('start-button');
    startButton.style.background = "rgb(158, 147, 130)";
    startButton.style.color = "#614d4d";
  }
}


const handleGoEndButtonClick = function (event) {
  if (event) {
    gameView.unShowCards(playerArray);
    const goEndButton = document.getElementById(`${event.srcElement.id}`)
    goEndButton.disabled = true;
    goEndButton.style.background = "rgb(158, 147, 130)";

  }
  if (!gameNotWon) { // message here is done in turn logic now
  } else if (deck.noCardsLeft) {
    const numActivePlayersArray = playerArray.filter(player => player.aliveStatus);
    const numActivePlayers = numActivePlayersArray.length;
    const messagebox = document.getElementById('message-box');
    if(numActivePlayers === 1) {
      messagebox.innerHTML = `Congratulations ${numActivePlayersArray[0].name}!!!! </br> You WON!🎉 Everyone else is dead`
      gameView.showHandCard(numActivePlayersArray[0]);
      const wonNoise = new Audio('./sounds/won.mp3')
      wonNoise.play();
    } else {
      let highestCardPlayer = numActivePlayersArray[0];
      let draw = false;
      for(i = 1; i < numActivePlayers; i++){
        if(highestCardPlayer.card.value < numActivePlayersArray[i].card.value){
          highestCardPlayer = numActivePlayersArray[i];
          draw = false;
        }
        else if (highestCardPlayer.card.value === numActivePlayersArray[i].card.value) {
          draw = true;
        }
      }
      if (draw) {
        messagebox.innerHTML = `No cards left in the deck</br> But it was a draw... NO ONE THINKS THIS WILL EVER HAPPEN!! Unicorns exist`;
        const youDrewNoise = new Audio('./sounds/draw.mp3');
        for (const player of numActivePlayersArray) {
          gameView.showHandCard(player);
        }
        youDrawNoise.play();
      } else {
        messagebox.innerHTML = `No cards left in the deck</br> Congratulations ${highestCardPlayer.name}!!!! You WON!🎉 with a ${highestCardPlayer.card.character}`
        for (const player of numActivePlayersArray) {
          gameView.showHandCard(player);
        }
        const wonNoise = new Audio('./sounds/won.mp3')
        wonNoise.play();
      }
    } // end of else

  } else {
    if (turnCounter < 3) {
      turnCounter += 1;
    } else {
      turnCounter = 0
    };
    setTimeout(playRound, 500)
  };
} // end end-go-button click


const playRound = function () {
  // console.log("Round:", turnCounter," kicked off!");
  const turnLogic = new Turn(playerArray[turnCounter], gameView, deck, playerArray);

  const numActivePlayersArray = playerArray.filter(player => player.aliveStatus);
  const numActivePlayers = numActivePlayersArray.length;

  if (numActivePlayers < 2) {
    gameNotWon = false;
    const messagebox = document.getElementById('message-box');
    messagebox.innerHTML = `Congratulations ${numActivePlayersArray[0].name}!!!! </br> You WON!!!! Everyone else is dead`
    handleGoEndButtonClick();
  } else if (turnLogic.playerIsActive(gameView)) {
    turnLogic.getSecondCard(deck, gameView);
    console.log("Turn of player:", turnLogic.activePlayer);
    // console.log("Hand card is:", turnLogic.activePlayer.card.character);
    // console.log("Deck card for their go: ", turnLogic.secondCard.character);

    const endOfGo = function () {
      const goEndButton = document.getElementById('end-go-button');
      goEndButton.style.background = "rgb(138, 218, 105)";
      goEndButton.disabled = false;
    }

    turnLogic.activateCardChoiceEventListener(endOfGo);
    skippedPlayer = 0;
  } else { // auto SKIP PLAYER AS THEY are dead
    handleGoEndButtonClick();
  };
} // end Round


document.addEventListener('DOMContentLoaded', function () {
  const startButton = document.getElementById('start-button');
  startButton.addEventListener('click', handleStartGameButton)

  const goEndButton = document.getElementById('end-go-button');
  goEndButton.addEventListener('click', (event) => {handleGoEndButtonClick(event)});
  goEndButton.disabled = true;
});




// goEndButton.style.hover =
// goEndButton.style.active =
//
// #end-go-button:hover {background-color: rgb(55, 221, 57)}
// #end-go-button:active {
// background-color: rgb(92, 231, 27);
// box-shadow: 1px 2px #666;
// transform: translateY(3px);
// }
