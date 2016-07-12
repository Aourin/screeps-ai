/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roles.miner');
 * mod.thing == 'a thing'; // true
 */
const mine = require('actions.mine');
const build = require('actions.build');
const gather = require('actions.gather');
const gatherStorage = require('actions.gatherStorage');
const repair = require('actions.repairClose');
const MIN_CARRY_THRESHOLD = 0.8;
const MIN_CAPACITY_THRESHOLD = 50;

const upgrader = require('roles.upgrader');
module.exports = {
    run: function () {
      const home = Game.getObjectById(this.memory.spawnId);
      let site;
      if (this.carry.energy === this.carryCapacity && this.memory.phase !== 'repair') {
          this.memory.phase = 'build';
      } else if (this.carry.energy === 0 && this.room.hasReserves(0.5)) {
          this.memory.phase = 'gather';
      } else if (this.room.hasStorageReserves()) {
          this.memory.phase = 'gatherStorage';
      } else if (this.carry.energy === 0) {
          this.memory.phase = 'mine';
      }
      
      switch (this.memory.phase) {
          case 'mine': mine.call(this);
            break;
          case 'repair': repair.call(this);
            break;
          case 'build': const resp = build.call(this);
            if (typeof resp === 'undefined') {
                this.memory.phase = 'repair';
            } else {
              break;
            }
          case 'gather': gather.call(this);
            break;
          case 'gatherStorage': gatherStorage.call(this);
          default: build.call(this);
      }

  }
};