var pid = process.pid;
console.log("[%s] Worker started.", pid);
var timeout = process.argv[2];
console.log("[%s] Worker ETA %s seconds", pid, timeout);
setTimeout(function() {
    console.log("[%s] Worker has finished.", pid);
}, timeout*1000);

