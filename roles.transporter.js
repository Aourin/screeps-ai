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
      const spawns = Memory.state.spawns.hash;
      const home = Game.getObjectById(this.memory.spawnId);
      
      if (!this.memory.targetId) {
        const spawnMiners = spawns[this.memory.spawnId].creeps.roles.miner;
        this.memory.targetId = spawnMiners[0];
      } else {
        const target = Game.getObjectById(this.memory.targetId);
        if (target) {
              //  Energy Harvesting for each spawn point
          if (_.sum(this.carry) < this.carryCapacity) {
            if (target.transfer(this, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
              this.moveTo(target);
            } 
          } else if (_.sum(this.carry) === parseInt(this.carryCapacity)) {
            deposit.call(this);
          }
        } else {
          delete this.memory.targetId;
          const spawnMeta =  Memory.state.spawns.hash[this.memory.spawnId];
          const localMiners = spawnMeta.creeps.roles.miner;
          if (localMiners.length) {
            this.memory.targetId = localMiners[_.random(0, localMiners.length -1)].id;
          }
        }
      
          
      }
    } 
      
    
};