# Fork Pool
Managing forks has never been easier!

[![Build Status](https://travis-ci.org/manthanhd/forkpool.svg?branch=master)](https://travis-ci.org/manthanhd/forkpool)

## How to

### Setup

Install the dependency

```shell
npm install --save forkpool
```

Define `ForkPool` and `Forklet`.

```javascript
var ForkPool = require('forkpool').ForkPool;
var Forklet = require('forkpool').Forklet;
```

### Usage

Initialise the pool. Here we create a pool of size `2`. This means that we'll only allow executing of at most two forklets in this particular pool.

```javascript
var pool = new ForkPool(2); 
```

Create a `Forklet`. A forklet is an object that defines how the process must be forked. The two parameters it requires are the file name to be forked and an array of arguments that needs to be passed to the forked process.

```javascript
var videoProcessingForklet = new Forklet('./videoprocessor.js', ["/movie.mov"]);
```

Our `videoProcessingForklet` is ready to be forked. The `pool.fork` function requires one argument with an additional optional argument:

1. The forklet object
2. A callback function that is subscribed to all events relating to that forklet. This is optional.

This callback function, if passed can accept two parameters as follows:

1. State object representing the state of the forklet. There are four distinct states:
  1. `scheduled`. This state means that the fork pool has maxed out and the forklet that has been passed has been scheduled for execution. Since the forklet hasn't actually been started, it's `processObject` isn't available yet and hence is `undefined`.
  2. `started`. The forklet has been started. The `processObject` for the underlying child process is now available.
  3. `timedout`. The time it took to execute the forklet has exceeded the timeout set within it and hence has been killed. An `exited` event is always fired after a `timedout` event.
  3. `exited`. The forklet has finished execution.
2. Inner child process object that is running the forklet. This object is only available when the forklet is in `started` or `exited` state. This is the standard Node.js `process` object. More about this object can be found [here](https://nodejs.org/api/process.html).

```javascript
pool.fork(videoProcessingForklet, function(stateObject, processObject) {
  if(stateObject.name === 'started') {
    // do something here
  }
});
```

## API Documentation

### ForkPool
A fork pool is a pool that manages execution of forks. In a way it orchestrates execution of forks based on it's size and definition of `forklet`. 

#### maxSize
Size of the pool. This must be passed in the constructor. It is highly recommended that you never change maxSize once it's defined to prevent collisions and dead pool. This value must be greater than zero.

#### Function: fork(forklet, callback)
Allows forking of a `forklet`. This function accepts two arguments: `forklet` and an optional callback subscribing to **all events** relating to the passed `forklet`. These events are:

1. scheduled
2. started
3. timedout
4. exited

### Forklet
A forklet is an object that defines how the child process must be forked. It has three fundamental components:

#### moduleName
This is the name of the module that will be forked. In layman terms, this is the JavaScript file that will be run in a separate process.

#### envars
Environment arguments/variables or arguments that will be passed to the child process upon execution. If your child process is going to read in a file, the value here might look something like ['/path/to/the/file']. This must always be an array, even if it only has one item.

#### (optional) timeout
Time in milliseconds. When the child process is executed, it will be allowed to run in this time. If it's execution time exceeds the time specified here, it will be killed with SIGKILL signal.

#### (optional) Function: onScheduled(callback)
Chainable function. Callback here is called when the forklet is scheduled for execution. Callback is called without any parameters.

#### (optional) Function: onStarted(callback)
Chainable function. Callback here is called when the forklet has been executed and is running as a child process. Callback is called with the child process object as its first parameter.

#### (optional) Function: onExited(callback)
Chainable function. Callback here is called when the child process relating to the forklet has finished its execution. Callback is called with a state params object containing exit state details ({code: code, signal: signal}) as its first parameter and the child process object as its second.

#### (optional) Function: onTimedout(callback)
Chainable function. Callback here is called when the child_process relating to the forklet has its execution time exceed the specified timeout (in ms). Callback is called with the child process object as its first parameter.

Feel free to raise issues on this Github project for any questions/suggestions.