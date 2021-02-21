const GameView = function () {
  this.numDiscardedCards = 0;
}

const characterMessages = {
  Guard: "ACTION: Choose a player and guess their card",
  Priest: "ACTION: Choose a player whose card you wish to see",
  Baron: "ACTION: Choose a player you wish to compare hands with",
  Handmaid: "You are protected from other card actions until your next go",
  Prince: "ACTION: Choose a player to discard their card",
  King: "ACTION: Choose a player you wish to swap cards with",
  Countess: "",
  Princess: "You are now out of the game!"
}

GameView.prototype.getPlayerName = function (playerNumber) {
  const playerNameInput = document.getElementById(`player${playerNumber}-inputName`); //input html box where users can type name
  const playerName = playerNameInput.value;
  const playerNameBox = document.getElementById(`player${playerNumber}-nameBox`) // div that previously contained an input
  playerNameBox.innerHTML = `<h1>${playerName}</h1>`; // change input to title using the name inputted.
  return playerName;
}

GameView.prototype.renderLayout = function (arrayOfPlayers) {
  // set up the space for cards
  for (i = 1; i <5; i++) {
    const playerHandCardImage = document.getElementById(`player${i}-handCardImage`);
    playerHandCardImage.src = url("./client/public/images/lovelettercard.png")
  }
}

GameView.prototype.showHandCard = function (player) {
  // Get player number from player then fill container for that player
  console.log("showing hand card of player:", player.playerNumber);
  const imageName = player.card.character;
  setImage(player, "hand", imageName);
}

GameView.prototype.showDeckCard = function (player, secondCard) {
  console.log("showing deck cards of player:", player.playerNumber);
  const imageName = secondCard.character;
  setImage(player, "deck", imageName);
}

GameView.prototype.unShowCards = function (playerArray) {
  // Get player number from player then fill container for that player
  for (const player of playerArray) {
    if (player.aliveStatus) {
      setImage(player, "hand", "lovelettercard");
    } else {
      setImage(player,"hand", "dead");
    }
    setImage(player, "deck","blank");
  }
}

GameView.prototype.addToDiscard = function (cardName) {
  const pile = document.getElementById('discard-pile-container');
  const discardedCard = document.createElement('img');
  discardedCard.src = `./images/${cardName}.png`;
  console.log("number of cards in discard pile: ", this.numDiscardedCards);
  discardedCard.classList = "discarded-card";
  if (!(this.numDiscardedCards === 0)) {
    const yShift = (this.numDiscardedCards * 280 * (-1));
    console.log(yShift);
    discardedCard.style.transform = `translateY(${yShift}px)`;
    console.log(discardedCard.style);
  }
  pile.appendChild(discardedCard);

  this.numDiscardedCards += 1;
}

GameView.prototype.askForPlayerChoicePrincess = function (holderPlayer, playerArray, endOfGoFunctions) {
  this.addToDiscard("princess");
  this.addToDiscard(`${holderPlayer.card.character}`);
  setTextInMessageBoxUponCardClick("Princess");
  holderPlayer.aliveStatus = false;
  this.unShowCards(playerArray);
  endOfGoFunctions();
}


GameView.prototype.askForPlayerChoiceCountess = function (holderPlayer, playerArray, endOfGoFunctions) {
  this.addToDiscard("countess");
  setTextInMessageBoxUponCardClick("Countess");
  endOfGoFunctions();
}


GameView.prototype.askForPlayerChoiceKing = function (holderPlayer, playerArray, endOfGoFunctions) {
  this.addToDiscard("king");
  let activePlayersNonProtected = [];
  for (const player of playerArray){
    if (!player.protected  && player.aliveStatus ) {
      activePlayersNonProtected.push(player);
    }
  }
  if (activePlayersNonProtected.length === 1)  {
    setBespokeTextInMessageBox(`You can't choose anyother players </br> All other players are either protected by the Handmaid or no longer active this round`);
    endOfGoFunctions();
  } else {
    setTextInMessageBoxUponCardClick("King");
    const playerChoiceSelector = setUpPlayerDropDown(holderPlayer, playerArray, false, endOfGoFunctions);
    submitChoice = setUpSubmitButton();

    submitChoice.addEventListener('click', () => {
      const chosenPlayer = getChosenPlayer(playerChoiceSelector, playerArray);
      setBespokeTextInMessageBox(`You choose to swap cards with ${chosenPlayer.name} </br>Your new card is ${chosenPlayer.card.character}`);
      removeOptionsAfterTurn(playerChoiceSelector, submitChoice);

      const holderPlayerCard = holderPlayer.card;
      const chosenPlayerCard = chosenPlayer.card;
      holderPlayer.card = chosenPlayerCard;
      chosenPlayer.card = holderPlayerCard;

      const chosenPlayerNewCardImageName = chosenPlayer.card.character;
      setImage(chosenPlayer, "hand", chosenPlayerNewCardImageName);
      const holderPlayerNewCardImageName = holderPlayer.card.character
      setImage(holderPlayer, "hand", holderPlayerNewCardImageName);
      setImage(holderPlayer,"deck","blank");
      endOfGoFunctions();
    });
  }
}


GameView.prototype.askForPlayerChoicePrince = function (holderPlayer, playerArray, endOfGoFunctions, deck) {
  this.addToDiscard("prince");
  let activePlayersNonProtected = [];
  for (const player of playerArray){
    if (!player.protected && player.aliveStatus) {
      activePlayersNonProtected.push(player);
    }
  }
  if (activePlayersNonProtected.length === 1)  {
    setBespokeTextInMessageBox(`You can't choose anyother players </br> All other players are either protected by the Handmaid or no longer active this round`);
    endOfGoFunctions();
  } else {
    setTextInMessageBoxUponCardClick("Prince");
    const playerChoiceSelector = setUpPlayerDropDown(holderPlayer, playerArray, true, endOfGoFunctions);
    submitChoice = setUpSubmitButton();

    submitChoice.addEventListener('click', () => {
      const chosenPlayer = getChosenPlayer(playerChoiceSelector, playerArray);
      setBespokeTextInMessageBox(`You chose to make ${chosenPlayer.name} discard their card`);
      removeOptionsAfterTurn(playerChoiceSelector, submitChoice);
      this.addToDiscard(`${chosenPlayer.card.character.toLowerCase()}`);
      if (chosenPlayer.card.character === "Princess") {
        chosenPlayer.aliveStatus = false;
        setBespokeTextInMessageBox(`You chose to make ${chosenPlayer.name} discard their card </br> They had the Princess so they are now dead!`);
      } else {
        if(!deck.noCardsLeft){
          chosenPlayer.card = deck.drawCard();
        } else {
          chosenPlayer.card = deck.initialRemovedCard;
        }
        const imageName = holderPlayer.card.character;
        setImage(holderPlayer,"hand", imageName);
      } // end else
      endOfGoFunctions();
    }); // end event listener
  }
}


GameView.prototype.askForPlayerChoiceHandmaid = function (holderPlayer, playerArray, endOfGoFunctions) {
  this.addToDiscard("handmaid");
  setTextInMessageBoxUponCardClick("Handmaid");
  holderPlayer.protected = true;
  endOfGoFunctions();
}


GameView.prototype.askForPlayerChoiceBaron = function (holderPlayer, playerArray, endOfGoFunctions) {
  this.addToDiscard("baron");
  let activePlayersNonProtected = [];
  for (const player of playerArray){
    if (!player.protected && player.aliveStatus) {
      activePlayersNonProtected.push(player);
    }
  }
  if (activePlayersNonProtected.length === 1) {
    setBespokeTextInMessageBox(`You can't choose anyother players </br> All other players are either protected by the Handmaid or no longer active this round`);
    endOfGoFunctions();
  } else {
  setTextInMessageBoxUponCardClick("Baron");
  const playerChoiceSelector = setUpPlayerDropDown(holderPlayer, playerArray, false, endOfGoFunctions);
  submitChoice = setUpSubmitButton();
  submitChoice.addEventListener('click', () => {
    const chosenPlayer = getChosenPlayer(playerChoiceSelector, playerArray);
    // Note: line below never appears as too quick
    setBespokeTextInMessageBox(`You chose to compare cards with ${chosenPlayer.name}</br>Their card is ${chosenPlayer.card.character}`);
    removeOptionsAfterTurn(playerChoiceSelector, submitChoice);
    this.showHandCard(chosenPlayer);
    if(chosenPlayer.card.value < holderPlayer.card.value) {
      chosenPlayer.aliveStatus = false;
      setBespokeTextInMessageBox(`Your card is higher than ${chosenPlayer.name}'s ${chosenPlayer.card.character} - ${chosenPlayer.name} dies!`);

      const imageName = chosenPlayer.card.character;
      this.addToDiscard(chosenPlayer.card.character);
      setImage(chosenPlayer,"hand","blank");
    } else if (chosenPlayer.card.value > holderPlayer.card.value) {
      holderPlayer.aliveStatus = false;
      setBespokeTextInMessageBox(`Your card is lower than ${chosenPlayer.name}'s ${chosenPlayer.card.character} - you die!`);

      const imageName = holderPlayer.card.character;
      this.addToDiscard(holderPlayer.card.character);
      setImage(holderPlayer,"hand","blank");
    } else {
      setBespokeTextInMessageBox(`You both have the same valued card - no one dies`);
    }
    endOfGoFunctions();
  });
}
}


GameView.prototype.askForPlayerChoicePriest = function (holderPlayer, playerArray, endOfGoFunctions) {
  this.addToDiscard("priest");
  let activePlayersNonProtected = [];
  for (const player of playerArray){
    if (!player.protected && player.aliveStatus) {
      activePlayersNonProtected.push(player);
    }
  }
  if (activePlayersNonProtected.length === 1)  {
    setBespokeTextInMessageBox(`You can't choose anyother players </br> All other players are either protected by the Handmaid or no longer active this round`);
    endOfGoFunctions();
  } else {
    setTextInMessageBoxUponCardClick("Priest");
    const playerChoiceSelector = setUpPlayerDropDown(holderPlayer, playerArray, false, endOfGoFunctions);
    submitChoice = setUpSubmitButton();
    submitChoice.addEventListener('click', () => {
      const chosenPlayer = getChosenPlayer(playerChoiceSelector, playerArray);
      setBespokeTextInMessageBox(`You choose to see card of "${chosenPlayer.name}" </br>Their card is ${chosenPlayer.card.character}`)
      removeOptionsAfterTurn(playerChoiceSelector, submitChoice);
      this.showHandCard(chosenPlayer);
      endOfGoFunctions();
    });
  }
}


GameView.prototype.askForPlayerChoiceGuard = function (holderPlayer, playerArray, endOfGoFunctions) {
  this.addToDiscard("guard");
  let activePlayersNonProtected = [];
  for (const player of playerArray){
    if (!player.protected && player.aliveStatus) {
      activePlayersNonProtected.push(player);
    }
  }
  if (activePlayersNonProtected.length === 1) {
    setBespokeTextInMessageBox(`You can't choose anyother players </br> All other players are either protected by the Handmaid or no longer active this round`);
    endOfGoFunctions();
  }
  else {
    setTextInMessageBoxUponCardClick("Guard");
    const playerChoiceSelector = setUpPlayerDropDown(holderPlayer, playerArray, false, endOfGoFunctions);
    const cardChoiceSelector = setUpCardDropDown()
    submitChoice = setUpSubmitButton();
    submitChoice.addEventListener('click', () => {
      const chosenPlayer = getChosenPlayer(playerChoiceSelector, playerArray);
      if (chosenPlayer.card.character === cardChoiceSelector.value){
        chosenPlayer.aliveStatus = false;
        setBespokeTextInMessageBox(`Correct! You guessed ${chosenPlayer.name} had a ${cardChoiceSelector.value},</br>${chosenPlayer.name} is out of the game!`);
        this.addToDiscard(`${chosenPlayer.card.character}`);
      } else {
        setBespokeTextInMessageBox(`Wrong! ${chosenPlayer.name} does not have a ${cardChoiceSelector.value}`);
      }
      removeOptionsAfterTurn(playerChoiceSelector, submitChoice, cardChoiceSelector);
      endOfGoFunctions();
    });
  }
}


// START OF HELPER FUNCTIONS
// (Think these could be refactored further)

const setImage = function(player, handOrDeck, imageName) {
  const playerNumber = player.playerNumber;
  const image = document.getElementById(`player${playerNumber}-${handOrDeck}CardImage`);
  image.src = `./images/${imageName}.png`
}

const setTextInMessageBoxUponCardClick = function(character) {
  const messagebox = document.getElementById("message-box");
  messagebox.innerHTML = `You played the ${character} card </br> ${characterMessages[character]}`
}

const setBespokeTextInMessageBox = function(text) {
  const messagebox = document.getElementById("message-box");
  messagebox.innerHTML = text;
}

const setUpPlayerDropDown = function(holderPlayer, playerArray, isAPrince, endOfGoFunctions) {
  const playerChoiceSelector = document.createElement('select');
  playerChoiceSelector.classList = "control-item";
  playerChoiceSelector.id = "player-select";
  let playerOptions = [];
  if(isAPrince) {
    for (const player of playerArray){
      if(player.aliveStatus && !player.protected) {
        playerOptions.push(player);
      } else { }
    }
    for (const player of playerOptions) {
      const option = document.createElement('option');
      option.classList = "control-item";
      option.textContent = player.name;
      option.value = JSON.stringify(player);
      playerChoiceSelector.appendChild(option);
    }
    const controlBox = document.getElementById('controls');
    controlBox.appendChild(playerChoiceSelector);
  } else {
    for (const player of playerArray){
      if(player !== holderPlayer && player.aliveStatus && !player.protected) {
        playerOptions.push(player);
      } else { }
    }
    if (playerOptions.length === 0) {
      setBespokeTextInMessageBox(`You can't choose anyother players </br> All other players are either protected by the Handmaid or no longer active this round`);

      endOfGoFunctions();
    }
    else {
      for (const player of playerOptions) {
        const option = document.createElement('option');
        option.classList = "control-item";
        option.textContent = player.name;
        option.value = JSON.stringify(player);
        playerChoiceSelector.appendChild(option);
      }
      const controlBox = document.getElementById('controls');
      controlBox.appendChild(playerChoiceSelector);
    }
  }
  return playerChoiceSelector;
}

const setUpCardDropDown = function() {
  const cardChoiceSelector = document.createElement('select');
  cardChoiceSelector.classList = "control-item";
  cardChoiceSelector.id = "card-select";
  for (let i = 2; i < 9; i++) {
    const optionCharacter = document.createElement('option');
    switch (i){
      case 2:
      optionCharacter.textContent = 'Priest';
      optionCharacter.value = 'Priest';
      break;
      case 3:
      optionCharacter.textContent = 'Baron';
      optionCharacter.value = 'Baron';
      break;
      case 4:
      optionCharacter.textContent = 'Handmaid';
      optionCharacter.value = 'Handmaid';
      break;
      case 5:
      optionCharacter.textContent = 'Prince';
      optionCharacter.value = 'Prince';
      break;
      case 6:
      optionCharacter.textContent = 'King';
      optionCharacter.value = 'King';
      break;
      case 7:
      optionCharacter.textContent = 'Countess';
      optionCharacter.value = 'Countess';
      break;
      case 8:
      optionCharacter.textContent = 'Princess';
      optionCharacter.value = 'Princess';
      break;
    }
    cardChoiceSelector.appendChild(optionCharacter);
  }
  const controlBox = document.getElementById('controls');
  controlBox.appendChild(cardChoiceSelector);
  return cardChoiceSelector;
}

const setUpSubmitButton = function() {
  const submitChoice = document.createElement('button');
  submitChoice.classList = "control-item";
  submitChoice.id = "player-submit-button";
  submitChoice.textContent = "Submit Player Choice!"
  const controlBox = document.getElementById('controls');
  controlBox.appendChild(submitChoice);
  return submitChoice;
}

const removeOptionsAfterTurn = function(playerChoiceSelector,submitChoice,  cardChoiceSelector) {
  const controlBox = document.getElementById('controls');
  controlBox.removeChild(playerChoiceSelector);
  controlBox.removeChild(submitChoice);
  if(cardChoiceSelector) {
    controlBox.removeChild(cardChoiceSelector);
  }
}

const getChosenPlayer = function(playerChoiceSelector, playerArray) {
  const chosenPlayerNumber =  JSON.parse(playerChoiceSelector.value).playerNumber;
  return playerArray[chosenPlayerNumber -1];
}

// END OF HELPER FUNCTIONS


module.exports = GameView;
