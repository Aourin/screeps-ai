const deposit = require('actions.deposit');
const mine = require('actions.mine');
const gatherStorage = require('actions.gatherStorage');
const roles = {
    miner: require('roles.miner'),
    transporter: require('roles.transporter'),
    builder: require('roles.builder'),
    upgrader: require('roles.upgrader'),
    fixer: require('roles.fixer'),
    knight: require('roles.knight')
};

module.exports = function () {
    let spawn;
    
    //  Check for a parent spawn and auto add if none
    if (!this.memory.spawnId && !this.memory.spawn) {
        spawn = this.room.find(FIND_MY_SPAWNS)[0];
        this.memory.spawnId = spawn.id;
        this.memory.spawn = spawn.name;
    } else {
        spawn = Game.spawns[this.memory.spawn];
        if (!spawn) {
            delete this.memory.spawnId;
            delete this.memory.spawn;
        }
        
    }
    
    //  Check renewal threshold
    if (this.ticksToLive < spawn.renewThreshold || (this.memory.phase === 'renew' && this.ticksToLive < spawn.renewTopoff)) {
        const storageContainers = this.room.find(FIND_STRUCTURES, {
            filter: (structure) => { 
                 return structure.structureType === STRUCTURE_CONTAINER && structure.store.energy > 0; }
        });
        const cannotGather = storageContainers.length === 0 && this.memory.phase === 'gatherStorage';
        // Deposit if carrying
        if (this.carry.energy > 0 && !this.room.hasReserves(1) ) {
            this.memory.phase = 'deposit';
        } else if (!this.room.hasEmptyReserves()) {
            this.memory.phase = 'renew';
        } else if (storageContainers.length) {
            this.memory.phase = 'gatherStorage';
        } else {
            this.memory.phase = 'mine';
        }
        
        switch (this.memory.phase) {
            case 'renew': 
                if (this.ticksToLive > spawn.renewTopoff) {
                    delete this.memory.phase;
                } else if (spawn && spawn.renewCreep(this) === ERR_NOT_IN_RANGE) {
                    this.moveTo(spawn);
                }
                break;
            case 'deposit': 
                deposit.call(this);
                break;
            case 'gatherStorage':
                gatherStorage.call(this);
                break;
            case 'mine':
                mine.call(this);
                break;
        }
    } else if (this.memory.role) {
        const role = roles[this.memory.role];
        if (role) {role.run.call(this);}
    }
    
    
}