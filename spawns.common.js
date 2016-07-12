//Tier 1
const DEFAULT_CONFIG = {
  miner: { min: 6, max: 15},
  transporter: { min: 6, max: 6},
  knight: { min: 3, max: 6},
  builder: { min: 2, max: 6},
  upgrader: { min: 1, max: 6},
  fixer: {min: 2, max: 3}
};
const TIER_1_TYPES = {
  miner: {
    body: [WORK, MOVE, CARRY, MOVE, CARRY], 
    memoryConfig: { role: 'miner', type: 'worker'}
  },
  transporter: {
    body: [MOVE, CARRY, WORK, MOVE, MOVE, MOVE], 
    memoryConfig: { role: 'transporter', type: 'worker' }
  },
  builder: {
    body: [MOVE, WORK, CARRY, MOVE],
    memoryConfig: { role: 'builder', type: 'worker'}
  },
  upgrader: {
    body: [MOVE, CARRY, CARRY, WORK, MOVE],
    memoryConfig: { role: 'upgrader', type: 'worker'}
  },
   fixer: {
    body: [MOVE, CARRY, CARRY, WORK, WORK],
    memoryConfig: { role: 'fixer', type: 'worker'}
  },
   knight: {
    body: [MOVE, MOVE, TOUGH, TOUGH, ATTACK, ATTACK],
    memoryConfig: { role: 'knight', type: 'worker'},
   }
};

//  Tier 2 Config
const TIER_2_TYPES = {
  miner: {
    body: [WORK, MOVE, CARRY, WORK, CARRY, MOVE], 
    memoryConfig: { role: 'miner', type: 'focal'}
  },
  transporter: {
    body: [MOVE, MOVE, WORK, CARRY, CARRY], 
    memoryConfig: { role: 'transporter', type: 'worker' }
  },
  builder: {
    body: [MOVE, WORK, WORK, CARRY, CARRY],
    memoryConfig: { role: 'builder', type: 'worker'}
  },
  upgrader: {
    body: [MOVE, CARRY, CARRY, WORK, MOVE, WORK],
    memoryConfig: { role: 'upgrader', type: 'worker'}
  },
  fixer: {
      
    body: [MOVE, CARRY, CARRY, WORK, MOVE, WORK],
    memoryConfig: { role: 'fixer', type: 'worker'}
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
    builder: [],
    knight: [],
    fixer: []
  }, Memory.state.spawns.hash[spawn.id].creeps.roles);
  const spawnCreep = createCreep(spawn);
  if (spawn.room.hasReserves(0.8)) {
  let ROLE_ORDER = ['miner','builder', 'upgrader', 'knight', 'fixer', 'transporter'];
  if (creepList.length > TIER_TWO_COUNT_START && spawn.room.energyCapacity > 1000) {
    ROLE_ORDER = ['miner', 'builder', 'upgrader', 'knight', 'transporter'];
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
}


module.exports = {
  createCreep: createCreep,
  manageWorkers: manageWorkers
};