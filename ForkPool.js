"use strict";

function ForkPool(maxSize) {
    const self = ForkPool;
    const queue = [];
    const childProcess = require('child_process');

    var size = 0;
    var maxSize = maxSize;
    ForkPool.maxSize = maxSize;

    ForkPool.fork = function(forklet, callback) {
        if (size >= maxSize) {
            queue.push({
                forklet: forklet,
                callback: callback
            });
            if (callback) {
                callback('scheduled');
            }
            return;
        }

        size++;
        var cproc = childProcess.fork(forklet.moduleName, forklet.envars);
        cproc.on('exit', function() {
            size--;
            if (callback) {
                callback('exited', cproc);
            }

            if (queue.length > 0) {
                var queueItem = queue[0];
                queue.splice(0, 1);
                self.fork(queueItem.forklet, queueItem.callback);
            }
        });

        if (callback) {
            callback('started', cproc);
        }

        return;
    };

    return ForkPool;
}

module.exports = ForkPool;