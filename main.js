const commonSpawnLogic = require('spawns.common');
const gather = require('actions.gather').default;
const getGlobalState = require('state.global');

const roles = {
    miner: require('roles.miner'),
    transporter: require('roles.transporter'),
    builder: require('roles.builder'),
    upgrader: require('roles.upgrader')
};
module.exports.loop = function () {
    Memory.state = getGlobalState();

    //  Iterate and run Spawn Logic
    for (var spawnName in Game.spawns) {
        commonSpawnLogic.manageWorkers(Game.spawns[spawnName]);
    }
    //  Iterate and Run Creep Logic
    for (var name in Game.creeps) {
        const creep = Game.creeps[name];
        const roleActions = roles[creep.memory.role];
        if (creep.memory.role && roleActions) {
          roleActions.run.apply(creep);
        }
    }
    //  Custom
    // Game.getObjectById('5779ed656991072c7aef969e').moveTo(Game.getObjectById);
    // const knight = Game.creeps['knight'];
    // const hostile = knight.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    // if(hostile) {
    //     if(knight.attack(target) == ERR_NOT_IN_RANGE) {
    //       knight.moveTo(target);
    //     }
    // }

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