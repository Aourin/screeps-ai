/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('actions.build');
 * mod.thing == 'a thing'; // true
 */

module.exports = function build () {
    
      let target;
      if (this.memory.buildTargetId) {
          target = Game.getObjectById(this.memory.buildTargetId);
      } else if (Array.isArray(this.memory.buildQueue) && this.memory.buildQueue.length) {
            this.memory.buildTargetId = this.memory.buildQueue.shift();
      } else if (this.memory.priority) {
          const buildTargets = this.find(priority);
          if (buildTargets.length) {
              this.memory.buildTargetId = buildTargets[0].id;
          }
      } else {
          target =  this.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
          if (target) {
              this.memory.buildTargetId = target.id;
          }
      }
      
      if (!target || this.build(target) === ERR_INVALID_TARGET) {
        delete this.memory.buildTargetId;
        if (Array.isArray(this.memory.buildQueue) && this.memory.buildQueue.length) {
            this.memory.buildTargetId = this.memory.buildQueue.shift();
            return 0;
        }
      } else {
         const resp = this.build(target);
         
         if (resp === ERR_NOT_IN_RANGE) {
           this.moveTo(target);
         }
         return resp;
        
      }
};