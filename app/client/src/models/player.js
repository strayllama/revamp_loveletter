const Player = function(name, playerNumber){
  this.name = name;
  this.card = null;
  this.aliveStatus = true;
  this.protected = false;
  this.playerNumber = playerNumber;
}


module.exports = Player;
