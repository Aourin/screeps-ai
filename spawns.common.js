const DEFAULT_CONFIG = {
  miner: { min: 1, max: 2},
  transporter: { min: 1, max: 3},
  builder: { min: 0, max: 2}
};
const CREEP_TYPES = {
  miner: {
    body: [WORK, MOVE, CARRY], 
    memoryConfig: { role: 'miner', type: 'focal'}
  },
  transporter: {
    body: [MOVE, CARRY], 
    memoryConfig: { role: 'transporter', type: 'worker' }
  },
  builder: {
    body: [MOVE, WORK, CARRY],
    memoryConfig: { role: 'builder', type: 'worker'}
  }
};


function createCreep (spawn) {
  return function (role, name, memoryConfig) {
    const attrs = Object.assign({}, CREEP_TYPES[role]);

    if (memoryConfig) {
      _.forIn(memoryConfig, (value, key) => {
        attrs.memoryConfig[key] = value;
      });
    }
    attrs.memoryConfig.spawnId = spawn.id;
    const resp = spawn.createCreep(attrs.body, name, attrs.memoryConfig);
    return resp;
  }
}     

/**
*  Manage the workers per spawn
*/
function manageWorkers (spawn, config) {
  const options = Object.assign({}, DEFAULT_CONFIG, config);
  const creepList = [];
  const creeps = {
    miner: [],
    builder: [],
    transporter: []
  };
  const spawnCreep = createCreep(spawn);
  const ROLE_ORDER = ['miner','transporter', 'builder'];
  //  Group creeps by role
  _.forIn(Game.creeps, (value, key) => {
      const role = value.memory.role;
      const spawnId = value.memory.spawnId;
      if (spawnId === spawn.id) {
        if (creeps[role]) {
          creeps[role].push(value);
        } else {
          creeps[role] = [value];
        }
        creepList.push(value);
      }    
  });

   //  Build Minimums
  const minMet = _.reduce(ROLE_ORDER, (cont, role) => {
    //  Continue if Previous is already built
    if (cont) {
      const creepConfig = options[role];
      const nameBase = spawn.name + '-' + role;
      const collection = creeps[role];
      //  Get Collection length and check against min
      if (collection.length < creepConfig.min) {
        const memoryConfig = {};
        const creepName = Array.isArray(collection) 
          ? (nameBase + '-' + collection.length) 
          : nameBase + '-0';

        //  Handle Transporter type
        // if (role === 'transporter' && creeps.miner.length) {
        //   const randomName = spawn.name + '-' + 'miner' + '-' + _.random(0, creeps.miner.length - 1);
        //   const randomMiner = Game.creeps[randomName];
        //   memoryConfig.targetId = randomMiner.id;
        // }
        //  Check for the spawn response and adjust
        const spawned = spawnCreep(role, creepName, memoryConfig);
        return spawned > -1 ? ((collection.length + 1) >= creepConfig.min) : false;
      } else {
        return true;
      } 
    } else {
      return cont;
    }
  }, true);

  if (minMet) {
     _.reduce(ROLE_ORDER, (cont, role) => {
      console.log('cont', cont);
      //  Continue if Previous is already built
      if (cont) {
        const creepConfig = options[role];
        const nameBase = spawn.name + '-' + role;
        const collection = creeps[role];
        console.log('check for', role);
        //  Get Collection length and check against min
        if (collection.length < creepConfig.max) {
          const memoryConfig = {};
          const creepName = Array.isArray(collection) 
            ? (nameBase + '-' + collection.length) 
            : nameBase + '-0';

          //  Handle Transporter type
          if (role === 'transporter' && creeps.miner.length) {
            const randomName = spawn.name + '-' + 'miner' + '-' + _.random(0, creeps.miner.length - 1);
            const randomMiner = Game.creeps[randomName];
            memoryConfig.targetId = randomMiner.id;
          }
          //  Check for the spawn response and adjust
          const spawned = spawnCreep(role, creepName, memoryConfig);
          return spawned > -1 ? ((collection.length + 1) >= creepConfig.min) : false;
        } else {
          return true;
        } 
      } else {
        return cont;
      }
    }, true);
  }

}

module.exports = {
  createCreep: createCreep,
  manageWorkers: manageWorkers
};