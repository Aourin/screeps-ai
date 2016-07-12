
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

function globalSpawnState () {
  const state = {
    list: [],
    hash: {}
  };

  _.forIn(Game.spawns, (spawnInstance, name) => {
    const spawnMeta = getSpawnInstanceState(spawnInstance);
    state.list.push(spawnMeta);
    state.hash[spawnInstance.id] = spawnMeta;
  });
  return state;
  
}

module.exports = {
  default: globalSpawnState,
  getSpawnInstanceState: getSpawnInstanceState
};