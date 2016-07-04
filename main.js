const commonSpawnLogic = require('spawns.common');

const roles = {
    miner: require('roles.miner'),
    transporter: require('roles.transporter'),
    builder: require('roles.builder')
};
module.exports.loop = function () {
    for (var spawnName in Game.spawns) {
        commonSpawnLogic.manageWorkers(Game.spawns[spawnName]);
    }
    for (var name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.memory.role) {
          roles[creep.memory.role].run.apply(creep);
        }
    }
    //  Clean dead creeps
    // for(var i in Memory.creeps) {
    //   if(!Game.creeps[i]) {
    //       delete Memory.creeps[i];
    //   }
    // }
}