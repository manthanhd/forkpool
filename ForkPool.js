function ForkPool(maxSize) {
    const self = ForkPool;
    const queue = [];
    const childProcess = require('child_process');

    var size = 0;
    ForkPool.maxSize = maxSize;

    ForkPool.fork = function (forklet, callback) {
        if (size >= maxSize) {
            queue.push({
                forklet: forklet,
                callback: callback
            });

            if (forklet.onScheduledCallback) {
                forklet.onScheduledCallback();
            }

            if (callback) {
                callback({name: 'scheduled'});
            }

            return;
        }

        size++;
        var cproc = childProcess.fork(forklet.moduleName, forklet.envars);
        if (forklet.timeout && forklet.timeout > 0) {
            (function (forklet, processObject, callback) {
                setTimeout(function () {
                    processObject.kill('SIGKILL');
                    if (forklet.onTimedoutCallback) {
                        forklet.onTimedoutCallback(processObject);
                    }

                    if (callback) {
                        callback({name: 'timedout'}, processObject);
                    }
                }, forklet.timeout);
            })(forklet, cproc, callback);
        }

        cproc.on('exit', function (code, signal) {
            size--;
            if (forklet.onExitedCallback) {
                forklet.onExitedCallback({code: code, signal: signal}, cproc);
            }

            if (callback) {
                callback({name: 'exited', stateParams: {code: code, signal: signal}}, cproc);
            }

            if (queue.length > 0) {
                var queueItem = queue[0];
                queue.splice(0, 1);
                self.fork(queueItem.forklet, queueItem.callback);
            }
        });

        if (forklet.onStartedCallback) {
            forklet.onStartedCallback(cproc);
        }

        if (callback) {
            callback({name: 'started'}, cproc);
        }
    };

    return ForkPool;
}

module.exports = ForkPool;
