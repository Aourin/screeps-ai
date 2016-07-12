/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('actions.mine');
 * mod.thing == 'a thing'; // true
 */

module.exports =  function mine () {
    const closest = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    const source = this.memory.sourceId ? Game.getObjectById(this.memory.sourceId) : this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

    this.memory.sourceId = source && source.id;
    const resp = this.harvest(source);
    if (resp === ERR_NOT_IN_RANGE) {
      this.moveTo(source);
      
      return resp;
    } else if (resp === ERR_INVALID_TARGET) {
      delete this.memory.sourceId;
    }  else {
      this.harvest(source);
    }
}