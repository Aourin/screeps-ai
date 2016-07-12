const NOTIFY_TICKS = 10;
const ROOM_ENERGY_THRESHOLD = 0.6;
Room.prototype.hasReserves = function (amount) {
  const compare = amount ? amount : ROOM_ENERGY_THRESHOLD;
  return (this.energyAvailable / this.energyCapacityAvailable) > amount;
}

Room.prototype.getCreepByRole = function (role) {
  return this.room.find(FIND_MY_CREEPS, {
      filter: {role: role}
  });
}

Room.prototype.hasEmptyReserves = function () {
  return this.energyAvailable === 0;
}

Room.prototype.hasStorageReserves = function (amount) {
    const storage = this.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.type === STRUCTURE_CONTAINER || structure.type === STRUCTURE_STORAGE)
                && (structure.store.energy > 0);
        }
    });
    if (storage.length) {
        const reserves = _.reduce(storage, (sum, store) => {
            return {capacity : store.storageCapacity + sum.max, available: sum.available + store.energy};
        }, {capacity: 0, available: 0});
        return (reserves.available / reserves.capacity) > amount;
    }
    return storage.length > 0;
}

Room.prototype.logStats = function () {
    if (Memory.notifyTick >= NOTIFY_TICKS) {
        Memory.notifyTick = 0;
         console.log('!---------- STATS START ----------!');
        console.log('');
        console.log('---- Energy Levels ----')
        const availablePercentage = ((this.energyAvailable * 100) / this.energyCapacityAvailable).toFixed(2);
        const graphNum = parseInt(availablePercentage / 10);
        const graph = '[X]'.repeat(graphNum) + '[ ]'.repeat(10 - graphNum);
        console.log(this.energyAvailable + ' out of ' + this.energyCapacityAvailable + ' Available Energy');
        console.log(graph + ' ' + availablePercentage + '% Energy');
        console.log('')
        console.log('---- Creeps ----');
        
        const creeps = this.find(FIND_MY_CREEPS);
        const groups = _.groupBy(creeps, 'memory.role');
        console.log('Total : ' + creeps.length);
        for (var name in groups) {
            console.log(name + ' : ' + groups[name].length);
        }
        console.log('!---------- STATS END ----------!');
    } else {
        Memory.notifyTick++;
    }
   
}