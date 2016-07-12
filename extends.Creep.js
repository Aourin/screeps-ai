//  Add to the queue to build next
Creep.prototype.addToBuildQueue = function (targetId) {
    let buildQueue = this.memory.buildQueue;
    if (Array.isArray(this.memory.buildQueue)) {
        this.memory.buildQueue.push(targetId);
    } else {
        this.memory.buildQueue = [targetId];
    }
}

//  Clears the build queue
Creep.prototype.clearBuildQueue = function () {
    this.memory.buildQueue = [];
}

//  Returns the role
Creep.prototype.getRole = function () {
    return this.memory.role;
}
Creep.prototype.setRole = function (role) {
    this.memory.role = role;
}
Creep.prototype.setPhase = function (phase) {
    this.memory.phase = phase;
}
Creep.prototype.getPhase = function () {
    return this.memory.phase;
}
Creep.prototype.clearPhase = function () {
    delete this.memory.phase;
}

//  Gets basic info
Creep.prototype.getInfo = function () {
    console.log('|--- INFO FOR CREEP "'+ this.name + '" ---|')
    console.log('|    Role: ' + this.memory.role + ', Phase: ' + this.memory.phase + ' ---|');
    console.log('|    Life: ' +(this.hits / this.hitsMax) * 100 + '%, ' + this.hits + ' of ' + this.hitsMax);
    switch (this.memory.phase) {
        case 'repair': console.log('RepairId: ' + this.memory.repairId); break;
        case 'build': console.log('BuildId: ' + this.memory.buildTargetId); break;
    }
}

//  Set Phase 
Creep.prototype.setPhase = function (phase) {
    this.memory.phase = phase;
}