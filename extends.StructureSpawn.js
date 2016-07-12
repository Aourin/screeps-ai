const RENEW_THRESHOLD  = 700;
const RENEW_TOP_OFF = 1200;
const RENEW_QUEUE_SIZE = 3;
const TIER_1_TYPES = {
  miner: {
    body: [WORK, MOVE, CARRY, MOVE, MOVE], 
    memoryConfig: { role: 'miner', type: 'focal'}
  },
  transporter: {
    body: [MOVE, CARRY, WORK, MOVE], 
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
    body: [MOVE, CARRY, CARRY, WORK],
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
    get: () => this.renewThreshold || RENEW_TOP_OFF,
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

/**
 * Adds creep to queue
 */
// StructureSpawn.prototype.addToQueue = function (creepName) {
//     this.renewQueue = this.renewQueue.concat(creepName);
// }
// StructureSpawn.prototype.hasCreepInQueue = function (creepName) {
//     return this.renewQueue.indexOf(creepName) >= 0;
// }
// /**
//  *  Renews Creeps in the queue
//  */
// StructureSpawn.prototype.renewCreepQueue = function () {

//   this.renewQueue = _.reduce(this.renewQueue, (list, name) => {
//       const creep = Game.creeps[name];
//       if (creep) {
//             const msg = this.renewCreep(creep);
//             if (msg === ERR_NOT_IN_RANGE) {
//               creep.moveTo(this);
//             }
//             return creep.ticksToLive < RENEW_TOP_OFF ? list.concat(name) : list;
//       }
      
//   }, []);
   
//   if (this.renewQueue.length < RENEW_QUEUE_SIZE) {
//       const renewableCreeps = this.room.find(FIND_MY_CREEPS, {filter: (creep) => creep.ticksToLive < RENEW_THRESHOLD});
//       renewableCreeps.sort((a,b) => a.ticksToLive - b.ticksToLive);
//       const names = _.map(renewableCreeps, 'name');
//       this.addToQueue(_.take(names, RENEW_QUEUE_SIZE - this.renewQueue.length));
//   }
// }

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
