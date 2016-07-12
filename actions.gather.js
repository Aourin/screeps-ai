const storageHasEnergy = require('filters.storageHasEnergy');
module.exports = function gather () {

  const containers = this.room.find(FIND_STRUCTURES, {
    filter: storageHasEnergy
  });
  let storage = containers.length ? containers[0] : undefined;
  if (!storage) {
    storage = this.pos.findClosestByRange(FIND_MY_STRUCTURES, {
      filter: storageHasEnergy
    });
  }
  if (!storage && this.memory.spawnId) {
    const home = Game.getObjectById(this.memory.spawnId);
    storage = home;
  }

  if (storage && typeof storage.transfer === 'function' && this.room.hasReserves(0.2)) {
    const transferred = storage.transfer(this, RESOURCE_ENERGY, (this.carryCapacity - _.sum(this.carry)));
   
    if(transferred === ERR_NOT_IN_RANGE){
      this.moveTo(storage);
    }
  }

  if (storage && typeof storage.transferEnergy === 'function' && this.room.hasReserves(0.2)) {
    const transferred = storage.transferEnergy(this);
    if(transferred === ERR_NOT_IN_RANGE){
      this.moveTo(storage);
    }
  }
  
}