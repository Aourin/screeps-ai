/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('extends.Flag');
 * mod.thing == 'a thing'; // true
 */
const TYPES = [
  'DEFEND',
  'NORMAL'
];

Object.defineProperty(Flag.prototype, 'type', {
    get: () => this.type || 'DEFEND',
    set: (type) => {
        if (TYPES.index(type) === -1) {
           console.error('Cannot set undeclared flag types');
        } else {
          this.type = type;
        }
    }
})