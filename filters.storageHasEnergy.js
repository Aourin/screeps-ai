module.exports = function storageHasEnergy (item) {
  const itemStore = (item.store && parseInt(item.store.energy) > 0);
  const hasEnergy = parseInt(item.energy) > 0;
  return (item.structureType === STRUCTURE_CONTAINER || item.structureType === STRUCTURE_EXTENSION)
   && (itemStore || hasEnergy);
}