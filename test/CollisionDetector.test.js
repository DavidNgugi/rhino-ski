import CollisionDetector from '../js/CollisionDetector';
// import EventManager from '../js/EventManager';
// import Event from '../js/Event';
import Game from '../js/Game';
import Skier from '../js/Skier';

var assert = require('assert');

const game = new Game(500, 500);

describe('Collision Detector', () => {

    require('jsdom-global')();

    before(() => {
        game.obstacles = [
            { type: 'tree', x: 100, y: 100},
            { type: 'treeCluster', x: 120, y: 150},
            { type: 'rock2', x: 150, y: 150}
        ]
        var skierDown = new Image(), 
            tree = new Image(),
            treeCluster = new Image(),
            rock2 = new Image();

        skierDown.width = 30; skierDown.height = 20;
        tree.width = 30; tree.height = 20;
        treeCluster.width = 100; treeCluster.height = 100;
        rock2.width = 100; rock2.height = 100;

        skierDown.src = 'path/to/file';
        tree.src = 'path/to/file';
        treeCluster.src = 'path/to/file';
        rock2.src = 'path/to/file';
        
        game.loadedAssets.images['skierDown'] = skierDown;
        game.loadedAssets.images['tree'] = tree;
        game.loadedAssets.images['treeCluster'] = treeCluster;
        game.loadedAssets.images['rock2'] = rock2;
        
        game.obstacles = [
            { type: 'tree', x: 100, y: 108 },  
            { type: 'treeCluster', x: 120, y: 150 }
        ];

        // game.placeNewObstacle(Skier);

    });

    // describe('When player hits obstacle', () => {

    //     before(() => {
    //         Skier.mapX = 100;
    //         Skier.mapY = 100;
    //         Skier.isMoving = true;
    //         Skier.hasCollided = false;
    //         Skier.direction = 3;

    //     });

    //     it("Should set direction to 0", (done) => {
    //         CollisionDetector.checkIfSkierHitObstacle(game, Skier);
    //         assert.equal(Skier.direction, 0);
    //         done();
    //     });

    //     it("Should stop player movement", (done) => {
    //         assert.equal(Skier.isMoving, false);
    //         done();
    //     });

    //     it("Should set collided flag to true", (done) => {
    //         assert.equal(Skier.hasCollided, true);
    //         done();
    //     });

    //     // it("Should fire GAME_OVER event", (done) => {
    //     //     assert.equal();
    //     // });
    // });

    // describe("When player doesn't hit obstacle", () => {

    //     it("Should increment score by 0.5", (done) => {
    //         CollisionDetector.checkIfSkierHitObstacle(game, Skier);
    //         assert.equal(game.score, 0.5);
    //         done();
    //     });
    // });

});