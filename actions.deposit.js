/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roles.miner');
 * mod.thing == 'a thing'; // true
 */
const storageHasEnergy = require('filters.storageHasEnergy');
module.exports = function deposit () {
    let storage = this.pos.findClosestByPath(FIND_MY_STRUCTURES, { filter: storageHasEnergy });

    console.log('storage', this.memory.spawnId);

    if (!storage && typeof this.memory.spawnId === 'string') {
      storage = Game.getObjectById(this.memory.spawnId);;
    } else {
      const newSpawn = this.room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_SPAWN}})[0];
      this.memory.spawnId = newSpawn.id;
    }


    if (this.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      this.moveTo(storage);
    }
};