const commonSpawnLogic = require('spawns.common');
const getGlobalState = require('state.global');
const commonRole = require('roles.common');

//  Load GameObject Extends and Utils
require('extends.StructureContainer');
require('extends.StructureSpawn');
require('extends.Room');
require('extends.Flag');
require('extends.Structure');
require('extends.Creep');

//  Main Game Loop
module.exports.loop = function () {
    Memory.state = getGlobalState();
    Game.spawns['Spawn1'].room.logStats();
    
    //  Iterate and run Spawn Logic
    for (var spawnName in Game.spawns) {
        const spawn = Game.spawns[spawnName]; 
        
        // if (currentDate > new Date('2016-07-06T07:00:00') && spawn.autoSpawn === false) {
        //     console.log("SETSUAOT");
        //     spawn.autoSpawn = true;
        // }
        if (spawn.autoSpawn) {
          spawn.runSpawnQueue();
        }
    }

    //  Iterate and Run Creep Logic
    for (var name in Game.creeps) {
        const creep = Game.creeps[name];
        
        commonRole.call(creep);
    }
}