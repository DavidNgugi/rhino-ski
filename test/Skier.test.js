import Skier from '../js/Skier';

var assert = require('assert');

describe('Skier', () => {

    describe('onMoveLeft()', () => {

        it("should change direction to 1 if direction 0", done => {
            Skier.direction = 0;
            Skier.onMoveLeft();
            assert.equal(Skier.direction, 1);
            done();
        });

        it("should change direction to 2 if direction not 0", done => {
            Skier.direction = 2;
            Skier.onMoveLeft();
            assert.equal(Skier.direction, 2);
            done();
        });
    });

    describe('onMoveRight()', () => {
        it("should change direction to 5 if direction 0", done => {
            Skier.direction = 0;
            Skier.onMoveRight();
            assert.equal(Skier.direction, 5);
            done();
        });

        it("should change direction to 4 if direction not 0", done => {
            Skier.direction = 2;
            Skier.onMoveRight();
            assert.equal(Skier.direction, 4);
            done();
        });

        it("should increase mapX by amount of speed", done => {
            Skier.mapX = 50;
            Skier.onMoveRight();
            assert.equal(Skier.mapX, 58);
            done();
        });
    });

    describe('onMoveDown()', () => {
        it("should change direction to 3 when moving down", done => {
            Skier.direction = 0;
            Skier.onMoveDown();
            assert.equal(Skier.direction, 3);
            done();
        });

        it("should increment speed if speed is less than 8", done => {
            Skier.speed = 5;
            Skier.onMoveDown();
            assert.equal(Skier.speed, 6);
            done();
        });

        it("should increase mapY by amount of speed", done => {
            Skier.mapY = 50;
            Skier.speed = 8;
            Skier.onMoveDown();
            assert.equal(Skier.mapY, 58);
            done();
        });
    });

    describe('onMoveUp()', () => {
        before(() => {
            Skier.speed = 8;
            Skier.mapY = 50;
            Skier.onMoveUp();
        });

        it("should reduce speed by 0.5 if speed is greater than 1", done => {
            assert.equal(Skier.speed, 7.5);
            done();
        });

        it("should stop Skier from moving", done => {
            assert.equal(Skier.isMoving, false);
            done();
        });

        it("should increase mapY by speed", done => {
            assert.equal(Skier.mapY, 57.5);
            done();
        });
    });
    
  
})
