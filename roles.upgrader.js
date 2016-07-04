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

const gather = require('actions.gather').default;
module.exports = {
  run: function () {
    if (_.sum(this.carry) === 0) {
      gather.call(this);
    }
    if(this.upgradeController(this.room.controller) == ERR_NOT_IN_RANGE) {
        this.moveTo(this.room.controller);    
    }  
  }
};