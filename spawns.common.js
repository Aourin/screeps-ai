//Tier 1
const DEFAULT_CONFIG = {
  miner: { min: 1, max: 6},
  transporter: { min: 1, max: 8},
  builder: { min: 1, max: 6},
  upgrader: { min: 1, max: 5},
};
const TIER_1_TYPES = {
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
  },
  upgrader: {
    body: [MOVE, CARRY, CARRY, WORK],
    memoryConfig: { role: 'upgrader', type: 'worker'}
  }
};

//  Tier 2 Config
const TIER_2_TYPES = {
  miner: {
    body: [WORK, MOVE, CARRY, WORK, CARRY], 
    memoryConfig: { role: 'miner', type: 'focal'}
  },
  transporter: {
    body: [MOVE, MOVE, MOVE, CARRY, CARRY], 
    memoryConfig: { role: 'transporter', type: 'worker' }
  },
  builder: {
    body: [MOVE, WORK, WORK, CARRY, CARRY],
    memoryConfig: { role: 'builder', type: 'worker'}
  },
  upgrader: {
    body: [MOVE, CARRY, CARRY, WORK, MOVE, WORK],
    memoryConfig: { role: 'upgrader', type: 'worker'}
  }
}
const TIER_TWO_COUNT_START = 7;
function createCreep (spawn) {
  return function (role, name, memoryConfig, tier) {
    const CREEP_TIER = tier ? tier : TIER_1_TYPES;
    const attrs = Object.assign({}, CREEP_TIER[role]);
    if (memoryConfig) {
      _.forIn(memoryConfig, (value, key) => {
        attrs.memoryConfig[key] = value;
      });
    }
    attrs.memoryConfig.spawnId = spawn.id;

    console.log('CREEPTIERs', attrs.memoryConfig.spawnId)
    const resp = spawn.createCreep(attrs.body, name, attrs.memoryConfig);
    return resp;
  }
}     

/**
*  Manage the workers per spawn
*/
function manageWorkers (spawn, config) {
  const options = Object.assign({}, DEFAULT_CONFIG, config);
  const creepList = Memory.state.spawns.hash[spawn.id].creeps.list;
  let creepTier = TIER_1_TYPES;
  const creeps = Object.assign({
    miner: [],
    transporter: [],
    upgrader: [],
    builder: []
  }, Memory.state.spawns.hash[spawn.id].creeps.roles);
  const spawnCreep = createCreep(spawn);
  let ROLE_ORDER = ['miner','transporter','upgrader','builder'];
  if (creepList.length > TIER_TWO_COUNT_START) {
    ROLE_ORDER = ['transporter', 'miner', 'builder', 'upgrader'];
    creepTier = TIER_2_TYPES;
   //  Build Minimums
  }
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
          ? (nameBase + '-' + _.random(0,10000)) 
          : nameBase + '-0';
        //  Check for the spawn response and adjust
        const spawned = spawnCreep(role, creepName, memoryConfig, creepTier);
       
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
      //  Continue if Previous is already built
      if (cont) {
        const creepConfig = options[role];
        const nameBase = spawn.name + '-' + role;
        const collection = creeps[role];
        //  Get Collection length and check against min
        if (collection.length < creepConfig.max) {
          const memoryConfig = {};
          const creepName = Array.isArray(collection) 
            ? (nameBase + '-' + _.random(0, 1000)) 
            : nameBase + '-0';

          //  Check for the spawn response and adjust
          const spawned = spawnCreep(role, creepName, memoryConfig, creepTier);
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