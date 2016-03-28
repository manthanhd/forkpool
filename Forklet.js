"use strict";

function Forklet(moduleName, envars) {
    const self = this;
    this.moduleName = moduleName;
    this.envars = envars;
}

module.exports = Forklet;