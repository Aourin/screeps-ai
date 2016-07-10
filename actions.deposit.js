/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roles.miner');
 * mod.thing == 'a thing'; // true
 */
const storageHasSpaceFilter = require('filters.storageHasSpace');
module.exports = function deposit (priority) {
    let storage;
    if ((this.memory.priority === 'closest' || priority === 'closest') && this.room.hasReserves(0.2)) {
        storage = this.pos.findClosestByPath(FIND_STRUCTURES, { filter : storageHasSpaceFilter})
    } else  if (!this.room.hasReserves(1)) {
        storage = this.pos.findClosestByPath(FIND_STRUCTURES, { filter: (item) => {
          return (item.structureType === STRUCTURE_EXTENSION || item.structureType === STRUCTURE_SPAWN) && item.energy < item.energyCapacity;
        }});
    } else {
        storage = this.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (item) => {
                return (item.structureType === STRUCTURE_CONTAINER || item.structureType === STRUCTURE_STORAGE) && item.availableSpace > 0;
            }
        });
    }

    if (this.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      this.moveTo(storage);
    }
};