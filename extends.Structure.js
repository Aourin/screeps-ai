/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('extends.Structure');
 * mod.thing == 'a thing'; // true
 */

Structure.prototype.isType = function isType (type) {
    return this.structureType === type;
}
Structure.prototype.hasHealth = function hasHealth (percent) {
    return (this.hits / this.hitsMax) >= percent;
}