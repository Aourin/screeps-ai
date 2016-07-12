const REPAIR_TOP_OFF = 0.8;
module.exports = function () {
    let container;
    if (this.memory.repairId) {
        container = Game.getObjectById(this.memory.repairId);
    } else {
        const containers = this.room.find(FIND_STRUCTURES, {
            filter: (s) => ((s.isType(STRUCTURE_CONTAINER) || s.isType(STRUCTURE_STORAGE)) && s.hasHealth(0.4))
         });
         
        containers.sort((a, b) => a.hits - b.hits);
        this.memory.repairId = containers[0].id;
    }
    
    if (container && container.hits < REPAIR_TOP_OFF * container.hitsMax) {
        const resp = this.repair(container);
        if (resp === ERR_NOT_IN_RANGE) {
            this.moveTo(container)
        }
        
    } else {
        delete this.memory.repairId;
    }
};