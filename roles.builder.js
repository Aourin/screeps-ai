/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roles.miner');
 * mod.thing == 'a thing'; // true
 */
const MIN_CARRY_THRESHOLD = 0.8;
module.exports = {
    run: function () {
      let target = this.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);

      if (target) {
        const resp = this.build(target);
        if (resp === ERR_NOT_ENOUGH_RESOURCES) {
          let storage = this.pos.findClosestByRange(STRUCTURE_CONTAINER);

          if (storage === ERR_INVALID_TARGET) {
            storage = this.pos.findClosestByRange(STRUCTURE_SPAWN);
          }
          if (storage === null) {
            storage = Game.getObjectById(this.memory.spawnId);
          }
          if (storage.transferEnergy(this) === ERR_NOT_IN_RANGE) {
            this.moveTo(storage);
          }
        }
        if (resp === ERR_NOT_IN_RANGE) {
          this.moveTo(target);
        }
      }


    }
    
};