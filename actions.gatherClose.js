

module.exports = function gatherClose () {
    const storage = this.pos.findClosestByPath(FIND_STRUCTURES,{
        filter: (structure) => {
            const isContainer = (structure.structureType === STRUCTURE_CONTAINER && structure.store.energy > 0);
            const isStorage = (structure.structureType === STRUCTURE_STORAGE && structure.store.energy > 0);
            return (isContainer || isStorage);
        }
    });
    
    if (storage) {
        console.log('staroge', storage.id);
        const resp = storage.transfer(this, RESOURCE_ENERGY);
        if (resp === ERR_NOT_IN_RANGE) {
            this.moveTo(storage);
        }
    }
}
