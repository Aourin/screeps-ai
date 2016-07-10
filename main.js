const commonSpawnLogic = require('spawns.common');
const getGlobalState = require('state.global');
const commonRole = require('roles.common');


require('extends.StructureContainer');
require('extends.StructureSpawn');
require('extends.Room');
require('extends.Flag');

module.exports.loop = function () {
    Memory.state = getGlobalState();
    Game.spawns['Spawn1'].room.logStats();
    let spawnsAreBusy = false;
    //  Iterate and run Spawn Logic
    for (var spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName]; 
        const currentDate = new Date();
        
        // if (currentDate > new Date('2016-07-06T07:00:00') && spawn.autoSpawn === false) {
        //     console.log("SETSUAOT");
        //     spawn.autoSpawn = true;
        // }
        if (spawn.autoSpawn) {
            // commonSpawnLogic.manageWorkers(Game.spawns[spawnName]);
        }
        
        // Renew the creeps in queue
        // spawn.renewCreepQueue();
        if (!spawn.canCreateCreep([], 'TEST_CREEP')) {
            spawnsAreBusy = true;
        }
        
    }
    // if (!spawnsAreBusy) {
    //     for(var i in Memory.creeps) {
    //         if(!Game.creeps[i]) {
    //             delete Memory.creeps[i];
    //         }
    //     }
    // }
    //  Iterate and Run Creep Logic
    for (var name in Game.creeps) {
        const creep = Game.creeps[name];
        
        commonRole.call(creep);
        // if (creep.memory.role && roleActions && creep.ticksToLive > spawn.renewThreshold) {
        //   roleActions.run.apply(creep);
        // } else if (_.sum(this.carry) > 0) {
        //   deposit.call(creep);
        // } else {
        //   roles.common.call(creep);
        // }
    }
    //  Custom

    // const upgrader = Game.creeps['mainUpgrader'];
    // if(upgrader.room.controller) {
    //     if (_.sum(upgrader.carry) === 0) {
    //       gather.call(upgrader);
    //     }
    //     if(upgrader.upgradeController(upgrader.room.controller) == ERR_NOT_IN_RANGE) {
    //         upgrader.moveTo(upgrader.room.controller);    
    //     }
    // }
    //  Clean dead creeps
    
}