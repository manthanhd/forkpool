var pid = process.pid;
console.log("[%s] Master started.", pid);
var timeout = 15;
console.log("[%s] Master ETA %s seconds", pid, timeout);
setTimeout(function() {
    console.log("[%s] Master has finished.", pid);
}, timeout * 1000);

var poolManager = require('./ForkPool')(2);
var Forklet = require('./Forklet');

poolManager.fork(new Forklet('./worker', [15]));
poolManager.fork(new Forklet('./worker', [8]));
poolManager.fork(new Forklet('./worker', [6]));
poolManager.fork(new Forklet('./worker', [12]), function(state, proc) {
    console.log("State for 12 is %s", state);
    if (proc) {
        console.log("ProcID: " + proc.pid);
    }
});

poolManager.fork(new Forklet('./worker', [5]));
poolManager.fork(new Forklet('./worker', [4]));