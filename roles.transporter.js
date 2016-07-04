/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roles.miner');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function () {
      const container = this.pos.findClosestByRange(STRUCTURE_CONTAINER);
      const home = Game.getObjectById(this.memory.spawnId);

      if (!this.memory.driverId) {
        _.forIn(Game.creeps, (value, key) => {
          if (!this.memory.driverId && value.memory.role === 'miner') {
            this.memory.driverId = value.id;
          }
        })
      }
      const miner = Game.getObjectById(this.memory.driverId);

      //  Energy Harvesting for each spawn point
      if (_.sum(this.carry) < this.carryCapacity) {
        if (miner.transfer(this, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          this.moveTo(miner);
        } 
      } else if (_.sum(this.carry) === parseInt(this.carryCapacity)) {
        let storage = container;
        if (this.transfer(storage, RESOURCE_ENERGY) === ERR_INVALID_TARGET) {
          storage = home;
        }
        if (this.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          this.moveTo(home);
        }
      }
      
    }
    
};