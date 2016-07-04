module.exports.default = function gather () {

  let storage = this.pos.findClosestByRange(STRUCTURE_CONTAINER);

  if (storage === ERR_INVALID_TARGET) {
    storage = this.pos.findClosestByRange(STRUCTURE_SPAWN);
  }

  if (storage === null && this.memory.spawnId) {
    const home = Game.getObjectById(this.memory.spawnId);
    storage = home;
  }

  if (storage && storage.transferEnergy(this) === ERR_NOT_IN_RANGE) {
    this.moveTo(storage);
  }
  
}