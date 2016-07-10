const REPAIR_THRESHOLD = 0.4;
const REPAIR_TOP_OFF = 1;
module.exports = function repair () {
    let repairSite;
    if (this.memory.repairId) {
      repairSite = Game.getObjectById(this.memory.repairId);
    } else {
        var targets = this.room.find(FIND_STRUCTURES, {
          filter: object => {
              return (object.hits < 1000 && object.structureType === STRUCTURE_WALL) || (object.structureType !== STRUCTURE_WALL && object.hits < REPAIR_THRESHOLD * object.hitsMax);
          }
        });
        if (targets.length) {
           targets.sort((a,b) => a.hits - b.hits);
           repairSite = targets[0];
           this.memory.repairId = repairSite.id;
           console.log(this.name + ' is going to repair ' + repairSite);
        }
    }
    
    if (repairSite && repairSite.hits < REPAIR_TOP_OFF * repairSite.hitsMax) {
        const resp = this.repair(repairSite);
        if (resp === ERR_NOT_IN_RANGE) {
            this.moveTo(repairSite);
        }
        return resp;
    } else {
        delete this.memory.repairId;
    }
  
}