/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('actions.uprade');
 * mod.thing == 'a thing'; // true
 */

module.exports = function () {
    const resp = this.upgradeController(this.room.controller);
    if (resp === ERR_NOT_IN_RANGE) {
        this.moveTo(this.room.controller);
    }
}