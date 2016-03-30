function Forklet(moduleName, envars, timeout) {
    this.moduleName = moduleName;
    this.envars = envars;
    this.timeout = timeout || -1;

    const self = this;

    this.onScheduled = function (callback) {
        self.onScheduledCallback = callback;
        return self;
    };

    this.onStarted = function (callback) {
        self.onStartedCallback = callback;
        return self;
    };

    this.onExited = function (callback) {
        self.onExitedCallback = callback;
        return self;
    };

    this.onTimedout = function (callback) {
        self.onTimedoutCallback = callback;
        return self;
    };
}

module.exports = Forklet;
