# Fork Pool
Managing forks has never been easier!

## How to
Install the dependency
```shell
npm install --save forkpool
```
Define `ForkPool` and `Forklet`.
```javascript
var ForkPool = require('forkpool').ForkPool;
var Forklet = require('forkpool').Forklet;
```
Initialise the pool. Here we create a pool of size `2`. This means that we'll only allow executing of at most two forklets in this particular pool.
```javascript
var pool = new ForkPool(2); 
```
Create a `Forklet`. A forklet is an object that defines how the process must be forked. The two parameters it requires are the file name to be forked and an array of arguments that needs to be passed to the forked process.
```javascript
var videoProcessingForklet = new Forklet('./videoprocessor.js', ["/movie.mov"]);
```
Our `videoProcessingForklet` is ready to be forked. The `pool.fork` function requires two arguments:

1. The forklet object
2. A callback function that is subscribed to all events relating to that forklet.

This callback function has two further arguments.

1. State of the forklet. There are three distinct states.
  1. `scheduled`. This state means that the fork pool has maxed out and the forklet that has been passed has been scheduled for execution. Since the forklet hasn't actually been started, it's `processObject` isn't available yet and hence is `undefined`.
  2. `started`. The forklet has been started. The `processObject` for the underlying child process is now available.
  3. `exited`. The forklet has finished execution.
2. Inner child process object that is running the forklet. This object is only available when the forklet is in `started` or `exited` state. This is the standard Node.js `process` object. More about this object can be found [here](https://nodejs.org/api/process.html).

```javascript
pool.fork(videoProcessingForklet, function(state, processObject) {
  if(state === 'started') {
    // do something here
  }
});
```

Feel free to raise issues on this Github project for any questions/suggestions.
