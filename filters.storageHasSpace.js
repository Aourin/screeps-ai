module.exports = function storageHasSpace (item) {
  const itemStore = (item.store && _.sum(item.store) < item.storeCapacity);
  const needsEnergy = parseInt(item.energy) < item.energyCapacity;
  return (item.structureType === STRUCTURE_CONTAINER || item.structureType === STRUCTURE_EXTENSION || item.structureType === STRUCTURE_SPAWN)
   && (itemStore || needsEnergy);
}
