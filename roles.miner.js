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
      const sources = this.room.find(FIND_SOURCES_ACTIVE);
      if (sources[0]) {
        if (this.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
          this.moveTo(sources[0]);
        } else {
          this.harvest(sources[0]);
        }
      } else {

      }
    }
    
};