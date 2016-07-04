/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roles.miner');
 * mod.thing == 'a thing'; // true
 */
const deposit = require('actions.deposit');
module.exports = {
    run: function () {
      let target = this.memory.targetId && Game.getObjectById(this.memory.targetId);
      if (_.sum(this.carry) === this.carryCapacity) {
        deposit.call(this);
      } else if (target) {
        if (this.harvest(target) === ERR_NOT_IN_RANGE) {
          this.moveTo(target);
        } else {
          this.harvest(target);
        }
      } else {
        const closest = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        const source = closest ? closest : this.room.find(FIND_SOURCES_ACTIVE)[0];
        this.memory.targetId = source.id;
      } 
    }
    
};