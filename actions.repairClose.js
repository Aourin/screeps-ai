const REPAIR_THRESHOLD = 0.4;
const REPAIR_TOP_OFF = 1;
const WALL_TOP_OFF = 1000;
module.exports = function repairClose (focus) {
    let repairSite;
    if (this.memory.repairId) {
        repairSite = Game.getObjectById(this.memory.repairId);
    } else {
        repairSite = this.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: object => {
               let structureFilter = object.structureType !== STRUCTURE_WALL;
               if (focus) {
                   structureFilter = object.isType(focus);
               }
               return (object.hits < 1000 && object.structureType === STRUCTURE_WALL && object.hitsMax > 1) || (structureFilter && object.hits < REPAIR_THRESHOLD * object.hitsMax);
            }
        });
    
    }
  
    if ((repairSite && !repairSite.isType(STRUCTURE_WALL)) || repairSite && repairSite.isType(STRUCTURE_WALL) && repairSite.hasHealth(0.1)) {
        if (repairSite.isType(STRUCTURE_WALL) && repairSite.hits < WALL_TOP_OFF ||
                (!repairSite.isType(STRUCTURE_WALL) && repairSite.hits < REPAIR_TOP_OFF * repairSite.hitsMax)) {
            const resp = this.repair(repairSite);
            this.memory.repairId = repairSite.id;
            if (resp === ERR_NOT_IN_RANGE) {
                this.moveTo(repairSite);
            }
            return resp;
        } else {
            delete this.memory.repairId;
        }
    }
  
}