const RENEW_THRESHOLD  = 700;
const RENEW_TOP_OFF = 1450;
const RENEW_QUEUE_SIZE = 3;
const TIER_1_TYPES = {
  miner: {
    body: [WORK, WORK, WORK, WORK, MOVE, CARRY, MOVE], 
    memoryConfig: { role: 'miner', type: 'worker'}
  },
  transporter: {
    body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY], 
    memoryConfig: { role: 'transporter', type: 'worker' }
  },
  builder: {
    body: [MOVE, WORK, WORK,WORK, CARRY, CARRY, MOVE, MOVE],
    memoryConfig: { role: 'builder', type: 'worker'}
  },
  upgrader: {
    body: [MOVE, CARRY, CARRY, WORK, MOVE],
    memoryConfig: { role: 'upgrader', type: 'worker'}
  },
   fixer: {
    body: [MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK],
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
    body: [MOVE, MOVE, MOVE, WORK, CARRY, CARRY, CARRY], 
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
  knight: {
    body: [MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, TOUGH, TOUGH, TOUGH, TOUGH],
    memoryConfig: { role: 'upgrader', type: 'combat'}
  },
  fixer: {
      
    body: [MOVE, CARRY, CARRY, WORK, MOVE, WORK],
    memoryConfig: { role: 'fixer', type: 'worker'}
  }
}

Object.defineProperty(StructureSpawn.prototype, 'renewThreshold', {
    get: () => this.renewThreshold || RENEW_THRESHOLD,
    set: (num) => {this.renewThreshold = num}
});
Object.defineProperty(StructureSpawn.prototype, 'renewTopoff', {
    get: () => this.renewTopoff || RENEW_TOP_OFF,
    set: (num) => {this.renewThreshold = num}
});

Object.defineProperty(StructureSpawn.prototype, 'renewQueue', {
    get: () => this.renewQueue || [],
    set: (arry) => {
        if (Array.isArray) {
            this.renewQueue = arry;
        } else {
            console.error('Cannot set renew queue to non array');
        }
        
    }
});
Object.defineProperty(StructureSpawn.prototype, 'autoSpawn', {
    get: () => typeof this.autoSpawn !== 'undefined' ? this.autoSpawn : true,
    set: (bool) => {this.autoSpawn = bool}
});


StructureSpawn.prototype.addToQueue = function (type) {
    if (Array.isArray(this.memory.spawnQueue)) {
        if (Array.isArray(type)) {
            this.memory.spawnQueue = this.memory.spawnQueue.concat(type);
        } else {
            this.memory.spawnQueue.push(type);
        }
    } else {
        this.memory.spawnQueue = [type];
    }
}
StructureSpawn.prototype.getQueue = function () {
    return this.memory.spawnQueue || [];
}
function getSpawnInstanceState (spawnInstance) {
  const state = {
    creeps: {
      list: [],
      roles: {}
    },
    name: spawnInstance.name,
    id: spawnInstance.id
  };
  //  Adds creepMeta per spawn
  _.forIn(Game.creeps, (creep, key) => {
    const role = creep.memory.role;
    const spawnId = creep.memory.spawnId;
    const creepMeta = {
      id: creep.id, 
      role: creep.memory.role, 
      name: creep.name
    };

    if (spawnId === spawnInstance.id) {
      if (state.creeps.roles[role]) {
        state.creeps.roles[role].push(creepMeta);
      } else {
        state.creeps.roles[role] = [creepMeta];
      }
      state.creeps.list.push(creepMeta);
    }    
  });
  return state;
}

StructureSpawn.prototype.createCreepType =  function (role, name, memoryConfig, tier) {
    if (tier === '2') {
        tier = TIER_2_TYPES;
    }
    const CREEP_TIER = tier ? tier : TIER_1_TYPES;
    const creepName = name ? name : (this.name + '-' + role + _.random(0, 1000));
    const attrs = Object.assign({}, CREEP_TIER[role]);
    if (memoryConfig) {
      _.forIn(memoryConfig, (value, key) => {
        attrs.memoryConfig[key] = value;
      });
    }
    attrs.memoryConfig.spawnId = this.id;
    attrs.memoryConfig.spawn = this.name;
    
    const resp = this.createCreep(attrs.body, name, attrs.memoryConfig);
    return resp;
}


StructureSpawn.prototype.runSpawnQueue = function () {
    if (this.autoSpawn && this.getQueue().length) {
        const queue = this.memory.spawnQueue;
        const creepType = queue[0]
        const config = TIER_1_TYPES[creepType];
        const canCreate = this.canCreateCreep(config.body);
        if (canCreate === 0 && !this.spawning) {
            queue.shift();
            console.log('Spawn - ' + this.name + ' is CREATING creep ' + creepType);
            this.createCreepType(creepType);
        } else if (!this.spawning){ 
            // console.log('Cannot create ' + creepType + ' at ' + this.name + ' Error:: ' + canCreate);
        };
    }
}
/**
*  Manage the workers per spawn
*/
StructureSpawn.prototype.runWorkerQueue = function (spawn, config) {
  const options = Object.assign({}, DEFAULT_CONFIG, config);
  const creepList = Memory.state.spawns.hash[spawn.id].creeps.list;
  let creepTier = TIER_1_TYPES;
  
  //  Create CreepMap
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
