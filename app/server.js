const express = require('express');
const parser = require('body-parser');
const app = express();

app.use(express.static('client/public'));

app.get('/', (req, res) => {
  res.sendFile(`${ __dirname }/client/public/index.html`);
});

const data4PlayerArray = [
  {
    "character": "Guard",
    "value": "1",
    "numberOfCards": "5",
    "description": "Name a non-Guard card and choose another player. If that player has that card, he or she is out of the round.",
    "image": ""
  },{
    "character": "Priest",
    "value": "2",
    "numberOfCards": "2",
    "description": "Look at another player's hand.",
    "image": ""
  },{
    "character": "Baron",
    "value": "3",
    "numberOfCards": "2",
    "description": "You and another player secretly compare hands. The player with the lower value is out of the round.",
    "image": ""
  },{
    "character": "Handmaid",
    "value": "4",
    "numberOfCards": "2",
    "description": "Until your next turn, ignore all effects from other players' cards.",
    "image": ""
  },{
    "character": "Prince",
    "value": "5",
    "numberOfCards": "1",
    "description": "Choose any player (including yourself) to discard his or her hand and draw a new card.",
    "image": ""
  },{
    "character": "King",
    "value": "6",
    "numberOfCards": "1",
    "description": "Trade hands with another player of your choice.",
    "image": ""
  },{
    "character": "Countess",
    "value": "7",
    "numberOfCards": "1",
    "description": "If you have this card and the King or Prince is in your hand, you must discard this card.",
    "image": ""
  },{
    "character": "Princess",
    "value": "8",
    "numberOfCards": "1",
    "description": "If you discard this card, you are out of the round.",
    "image": ""
  }]

  // INDEX Route - get all data from our API
  app.get('/data4players', function (req, res) {
    console.log("***INDEXall: Returning all data on Loveletter Server.");
    res.json(data4PlayerArray);
  });


app.listen(3000, function () {
  console.log(`Example app listening on port ${ this.address().port }`);
});
