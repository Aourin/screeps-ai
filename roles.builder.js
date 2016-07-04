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

const upgrader = require('roles.upgrader');
const gather = require('actions.gather').default;
module.exports = {
    run: function () {
      const home = Game.getObjectById(this.memory.spawnId);
      let target = this.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
      if (!target) {
        upgrader.run.call(this);
      }

      if (target &&  _.sum(this.carry) > 0.5 * this.carryCapacity) {
        const resp = this.build(target);
        if (resp === ERR_NOT_ENOUGH_RESOURCES) {
          gather.call(this);
        } else if (resp === ERR_NOT_IN_RANGE) {
          this.moveTo(target);
        }
      } else {
        gather.call(this);
      }
      

  }
    
};