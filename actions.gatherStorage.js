

module.exports = function gatherStorage () {
    const storage = this.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => (structure.structureType === STRUCTURE_CONTAINER && structure.store.energy > 0)
    });
    if (storage) {
        const resp = storage.transfer(this, RESOURCE_ENERGY);
        if (resp === ERR_NOT_IN_RANGE) {
            this.moveTo(storage);
        }
        return resp;
    } else {
        return;
    }
}
