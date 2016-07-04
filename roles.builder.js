/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roles.miner');
 * mod.thing == 'a thing'; // true
 */
const miner = require('roles.miner');
const MIN_CARRY_THRESHOLD = 0.8;
const MIN_CAPACITY_THRESHOLD = 50;

module.exports = {
    run: function () {
      const home = Game.getObjectById(this.memory.spawnId);
      let target = this.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);

      const getEnergy = () => {
        let storage = this.pos.findClosestByRange(STRUCTURE_CONTAINER);

        if (storage === ERR_INVALID_TARGET) {
          storage = this.pos.findClosestByRange(STRUCTURE_SPAWN);
        }

        if (storage === null) {
          storage = home;
        }

        if (storage.energy < MIN_CAPACITY_THRESHOLD && _.sum(this.carry) < 10) {
          miner.run.call(this);
        } else if (storage.transferEnergy(this) === ERR_NOT_IN_RANGE) {
          this.moveTo(storage);
        }
      }

      if (target &&  _.sum(this.carry) > 0.5 * this.carryCapacity) {
        const resp = this.build(target);
        if (resp === ERR_NOT_ENOUGH_RESOURCES) {
          getEnergy();
        } else if (resp === ERR_NOT_IN_RANGE) {
          this.moveTo(target);
        }
      } else {
        getEnergy();
      }

  }
    
};