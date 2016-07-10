/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('extends.StructureContainer');
 * mod.thing == 'a thing'; // true
 */

Object.defineProperty(StructureContainer.prototype, 'availableSpace', {
    get: function () {return (parseInt(this.storeCapacity) - _.sum(this.store)) }
});