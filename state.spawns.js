
function getSpawnInstanceState (spawnInstance) {
  const state = {
    list: [],
    hash: {}
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
      if (state.hash[role]) {
        state.hash[role].push(creepMeta);
      } else {
        state.hash[role] = [creepMeta];
      }
      state.list.push(creepMeta);
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
    state.hash[name] = spawnMeta;
  });
  return state;
  
}

module.exports = {
  default: globalSpawnState,
  getSpawnInstanceState: getSpawnInstanceState
};