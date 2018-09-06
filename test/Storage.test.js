import Storage from '../js/Storage';
import MockLocalStorage from './MockLocalStorage';

var assert = require('assert');
var expect = require('chai').expect;

// Replace the Window Local Storage with our Mock Local Storage implementation
Object.defineProperty(window, 'localStorage', {
    value: MockLocalStorage
});

describe('Storage', () => {

    describe('Highscores', () => {

        describe('When saving highscores', () => {

            it("should not save null value", done => {
                expect(Storage.highscore.set).to.throw("Value cannot be empty");
                done();
            });

            it("should save to local storage", done => {
                // console.log(window.localStorage)
                Storage.highscore.set(50);
                var expected = [50];
                var actual = Storage.highscore.get();
                // console.log(actual);
                assert.equal(actual[0], expected[0]);
                done();
            });

        });

    });
    
    describe('Game Data', () => {

        describe('When saving game data', () => {

            it("should not save null value", done => {
                expect(Storage.game.set).to.throw("Data cannot be empty");
                done();
            });

            it("should save to local storage", done => {
                var data = { 'game': {}, 'skier': {} };
                Storage.game.set(data);
                var actual = Storage.game.get();
                assert.deepEqual(typeof actual, typeof data);
                done();
            });

        });

        describe('When retrieving game data', () => {

            it("should get data as JSON", done => {
                var data = { 'game': {}, 'skier': {} };
                Storage.game.set(data);
                var actual = Storage.game.get();
                assert.deepEqual(actual.game, {});
                done();
            });

        });

        describe('When clearing game data', () => {

            it("should have no data in local storage", done => {
                Storage.game.clear();
                assert.equal(Storage.game.get(), null);
                done();
            });

        });

    });

});