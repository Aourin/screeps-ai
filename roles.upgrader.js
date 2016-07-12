/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roles.miner');
 * mod.thing == 'a thing'; // true
 */

const MIN_CARRY_THRESHOLD = 0.8;
const MIN_CAPACITY_THRESHOLD = 50;

const gather = require('actions.gather');
const mine = require('actions.mine');
const gatherClose = require('actions.gatherClose');
const gatherStorage = require('actions.gatherStorage');

module.exports = {
  run: function () {
    if (_.sum(this.carry) === this.carryCapacity) {
        this.memory.phase = 'upgrade';
    } else if (_.sum(this.carry) === 0 && this.room.hasReserves(0.5)) {
        this.memory.phase = 'gatherClose';
    } else if (this.carry.energy === 0 && this.room.hasStorageReserves(0)) {
        this.memory.phase = 'gatherStorage';    
    } else if (_.sum(this.carry) === 0) {
        this.memory.phase = 'mine';
    }
    switch (this.memory.phase) {
        case 'upgrade':
            const resp = this.upgradeController(this.room.controller);
            if(resp == ERR_NOT_IN_RANGE) {
               this.moveTo(this.room.controller);    
            } 
            break;
        case 'mine': mine.call(this); break;
        case 'gatherClose': gatherClose.call(this); break;
        case 'gatherStorage': gatherStorage.call(this); break;
    }
   
  }
};