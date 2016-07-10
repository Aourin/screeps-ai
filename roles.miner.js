/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roles.miner');
 * mod.thing == 'a thing'; // true
 */
const deposit = require('actions.deposit');
const build = require('actions.build');
const mine = require('actions.mine');
const upgrade = require('actions.uprade');
module.exports = {
    run: function () {
      if (this.carry === this.carryCapacity && this.room.hasReserves(0.9) && this.room.hasStorageReserves(0.5)) {
        this.memory.phase = 'upgrade';
      } else if (this.room.find(FIND_MY_CONSTRUCTION_SITES).length && this.room.hasReserves(0.9) && _.sum(this.carry) === this.carryCapacity) {
        this.memory.phase = 'build';
      } else if (_.sum(this.carry) === this.carryCapacity) {
        this.memory.phase ='deposit';
      } else if (_.sum(this.carry) === 0) {
        this.memory.phase = 'mine';
      } else if (typeof this.memory.phase === 'undefined') {
        this.memory.phase = 'mine';
      }
      
      switch (this.memory.phase) {
        case 'upgrade': upgrade.call(this); break;
        case 'build': build.call(this); break;
        case 'deposit': deposit.call(this, 'closest'); break;
        case 'mine': 
            mine.call(this);
        
      } 
    }
    
};