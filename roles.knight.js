
module.exports = {
    run: function () {
        let hostile;
        if (this.memory.enemyId) {
            hostile = Game.getObjectById(this.memory.enemyId);
        } else {
            hostile = this.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            if (hostile) {
                this.memory.enemyId = hostile.id;
            }
        }
        if (!this.memory.rallyPoint || typeof this.memory.rallyPoint !== 'string') {
            const flags = this.room.find(FIND_FLAGS, {filter: {type: 'DEFEND'}});
            if (flags.length) {
                this.memory.rallyPoint = flags[_.random(0, flags.length - 1)].name;
            }
        }
        if (hostile) {
            const msg = this.attack(hostile);
            if (msg === ERR_NOT_IN_RANGE) {
                this.moveTo(hostile);
            }
        } else if (this.memory.rallyPoint) {
            this.moveTo(Game.flags[this.memory.rallyPoint])
        }
    }
};