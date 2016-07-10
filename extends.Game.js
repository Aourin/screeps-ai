Object.definedProperty(Game.prototype, 'groups', {
    get: () => this.group || {},
    set: (group) => this.group = group;
});

