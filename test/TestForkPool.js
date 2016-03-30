var should = require('should');
var expect = require('chai').expect;
var sinon = require('sinon');
var ForkPool = require('../ForkPool');
var Forklet = require('../Forklet');

describe('ForkPool', function() {
    it('initialises correctly', function() {
        var forkPool = new ForkPool(4);

        forkPool.should.exist;
        forkPool.should.have.property('maxSize');
        forkPool.should.have.property('fork');
    })

    it('schedules excess forks', function() {
        var pool = new ForkPool(2);
        var forklet1 = new Forklet('./test/TestTimeoutWorker', [2]);
        var forklet2 = new Forklet('./test/TestTimeoutWorker', [2]);
        var forklet3 = new Forklet('./test/TestTimeoutWorker', [2]);

        pool.fork(forklet1);
        pool.fork(forklet2);
        const forklet3SubscriptionCallback = sinon.spy();
        pool.fork(forklet3, forklet3SubscriptionCallback);
        forklet3SubscriptionCallback.calledWith('scheduled').should.equal(true);
    })

    it('starts forks', function() {
        var pool = new ForkPool(2);
        var forklet1 = new Forklet('./test/TestTimeoutWorker', [2]);
        var forklet2 = new Forklet('./test/TestTimeoutWorker', [2]);
        var forklet3 = new Forklet('./test/TestTimeoutWorker', [2]);

        var forklet1SubscriptionCallback = sinon.spy();
        pool.fork(forklet1, forklet1SubscriptionCallback);
        forklet1SubscriptionCallback.calledWith('started').should.equal(true);

        var forklet2SubscriptionCallback = sinon.spy();
        pool.fork(forklet2, forklet2SubscriptionCallback);
        forklet2SubscriptionCallback.calledOnce.should.equal(true);
        forklet2SubscriptionCallback.calledWith('started').should.equal(true);
    })
});
