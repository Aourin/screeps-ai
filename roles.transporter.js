const deposit = require('actions.deposit');
const gatherStorage = require('actions.gatherStorage');
const gather = require('actions.gather');

module.exports = {
    run: function () {
        if (this.carry.energy === this.carryCapacity || (this.carry.energy > 0 && this.memory.phase === 'deposit')) {
          this.memory.phase = 'deposit';
        } else if (!this.room.hasReserves(0.8)) {
          this.memory.phase = 'gatherStorage';
        } else {
          this.memory.phase = 'gatherCreep';
        }
        
        switch (this.memory.phase) {
            case 'deposit': deposit.call(this);
                break;
            case 'gatherStorage': const resp = gatherStorage.call(this); console.log('resp', resp);
                if (typeof resp === 'undefined') {
                    console.log('gather');
                    this.memory.phase = 'gatherCreep';
                } else {
                  
                }
            case 'gatherCreep': 
                const creep = this.pos.findClosestByPath(FIND_MY_CREEPS, {
                    filter: (crp) => _.sum(crp.carry) > 0 && (crp.memory.phase == 'mine' || (crp.memory.phase === 'deposit' && crp.memory.role !== 'transporter'))
                });
                if (creep) {
                    const transferResp = creep.transfer(this, RESOURCE_ENERGY);
                    if (transferResp  === ERR_NOT_IN_RANGE) {
                        this.moveTo(creep);
                    }
                }
        }
        
    //   const spawns = Memory.state.spawns.hash;
    //   const home = Game.getObjectById(this.memory.spawnId);
    //   const spawnMiners = spawns[this.memory.spawnId].creeps.roles.miner;
      
    //   const target = this.memory.targetId && Game.getObjectById(this.memory.targetId);
    //   if (this.memory.phase === 'deposit') {
    //       deposit.call(this);
    //   } else if (!this.memory.targetId && Array.isArray(spawnMiners) && spawnMiners.length) {
    //     this.memory.targetId = spawnMiners[_.random(0, spawnMiners.length -1)];
    //   } else if (!this.memory.targetId) {
    //     this.moveTo(Game.flags['rally']);
    //   } else if (target && typeof target.carry !== 'undefined') {
    //     if (target.transfer(this, RESOURCE_ENERGY, _.sum(this.carry)) === ERR_NOT_IN_RANGE) {
    //       this.moveTo(target);
    //     } 
    //   } else {
    //       delete this.memory.targetId;
    //       const spawnMeta =  Memory.state.spawns.hash[this.memory.spawnId];
    //       const localMiners = spawnMeta.creeps.roles.miner;
    //       if (localMiners.length) {
    //         this.memory.targetId = localMiners[_.random(0, localMiners.length -1)].id;
    //       }
    //   }
    } 
};