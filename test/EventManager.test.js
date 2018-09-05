import EventManager from '../js/EventManager';

var assert = require('assert');

var expect = require('chai').expect;

var testEvent = 'TEST:EVENT',
    handler = (e) => {},
    handler2 = (e) => {},
    handler3 = (e) => {},
    target = () => {},
    expectedRegisteredEventListenersCount = 0;

describe('Event Manager', () => {

    describe('When registering a new Event', () => {

        beforeEach(() => {
            EventManager.reset();
        });

        it('Should register listeners for given event', (done) => {
           
            EventManager.on(testEvent, handler, target);

            expectedRegisteredEventListenersCount = 1;
            var actualRegisteredEventListenersCount = EventManager.getListeners(testEvent).length;

            assert.equal(actualRegisteredEventListenersCount, expectedRegisteredEventListenersCount);

            done();
        });

        it('Should not register multiple listeners for same event', done => {
            EventManager.on(testEvent, handler, target);
            EventManager.on(testEvent, handler2, target);
            EventManager.on(testEvent, handler3, target);

            expectedRegisteredEventListenersCount = 3;
            var actualRegisteredEventListenersCount = EventManager.getListeners(testEvent).length;

            assert.notEqual(actualRegisteredEventListenersCount, expectedRegisteredEventListenersCount);

            done();
        });

        it('Should not register listeners for same event more than twice', (done) => {
        
            EventManager.on(testEvent, handler, target);
            EventManager.on(testEvent, handler, target);

            expectedRegisteredEventListenersCount = 1;
            var actualRegisteredEventListenersCount = EventManager.getListeners(testEvent).length;

            assert.equal(actualRegisteredEventListenersCount, expectedRegisteredEventListenersCount);

            done();
        });
    });

    describe('When Firing a new Event', () => {

        beforeEach(() => {
            EventManager.reset();
        });

        it("Should throw and error when attempting to fire unregistered event", (done) => {
            
            expect(EventManager.fire).to.throw('Event not fired');

            done();
        });

        it("Should fire a Registered event", (done) => {
            var testEvent = 'TEST:EVENT',
                handler = (e) => {result = true},
                result = false,
                target = () => {};

            EventManager.on(testEvent, handler, target);

            EventManager.fire(testEvent);

            assert.equal(result, true);

            done();
        });
    });
});
