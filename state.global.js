const spawnState = require('state.spawns').default;

module.exports = function getGlobalState () {
  const state = {
    spawnCreeps: spawnState()
  };
  return state;
}