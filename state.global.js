const spawnState = require('state.spawns').default;

module.exports = function getGlobalState () {
  const state = {
    spawns: spawnState()
  };
  return state;
}