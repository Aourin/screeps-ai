/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roles.fixer');
 * mod.thing == 'a thing'; // true
 */
const repair = require('actions.repair');
const repairStorage = require('actions.repairStorage');
const repairClose = require('actions.repairClose');
const gatherClose = require('actions.gatherClose');
const build  = require('actions.build');
module.exports = {
    run: function run () {
        if (_.sum(this.carry) === 0 && (this.room.hasReserves(0.2) || this.room.hasStorageReserves(0.2))) {
          this.memory.phase = 'gatherClose';
        } else if (_.sum(this.carry) > 0) {
            this.memory.phase = 'repairStorage';
        } else if (typeof this.memory.phase === 'undefined') {
            this.memory.phase = 'repairClose';
        } else if (this.carry.energy === 0 && this.room.hasEmptyReserves()) {
            this.memory.phase = 'mine';
        }
        switch (this.memory.phase) {
            case 'repair': repair.call(this); break;
            case 'repairClose': repairClose.call(this, this.memory.focus); break;
            case 'repairStorage': repairStorage.call(this); break;
            case 'gatherClose': gatherClose.call(this); break;
            case 'build' : build.call(this); break;
            default: this.memory.phase = 'repair';
                repair.call(this);
        }
    }
}
    