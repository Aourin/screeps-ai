/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roles.miner');
 * mod.thing == 'a thing'; // true
 */

module.exports = function deposit () {
    const container = this.pos.findClosestByRange(STRUCTURE_CONTAINER);
    const home = Game.getObjectById(this.memory.spawnId);

    let storage = container;
    if (this.transfer(storage, RESOURCE_ENERGY) === ERR_INVALID_TARGET) {
      storage = home;
    }
    if (this.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      this.moveTo(home);
    }
};