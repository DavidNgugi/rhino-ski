import Event from './Event';
import EventManager from './EventManager';
import AssetManager from './AssetManager';
import Storage from './Storage';
import Skier from './Skier';

export default class Game {
    constructor() {
        this.ctx = null;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.obstacleTypes = ['tree', 'treeCluster', 'rock1', 'rock2'];
        this.obstacles = [];
        this.loadedAssets = { images: {}, audio: {} };
        this.score = 0;
        this.state = { 'started': false, 'paused': false, 'resumed': false, 'gameOver': false };
    }

    reset() {
        this.loadedAssets = { images: {}, audio: {} };
        this.obstacleTypes = ['tree', 'treeCluster', 'rock1', 'rock2'];
        this.obstacles = [];
        this.score = 0;
    }

    onReset() {
        this.reset();
        EventManager.fire(Event.RESET_SKIER);
        // EventManager.fire(Event.RESET_RHINO);
        EventManager.fire(Event.RESET_STORAGE);
    }

    onShowMenu() {
        $('.game-ui, .game-start-menu').show();
    }

    createCanvas() {
        return $('<canvas></canvas>')
            .attr('width', this.width * window.devicePixelRatio)
            .attr('height', this.height * window.devicePixelRatio)
            .css({
                width: this.width + 'px',
                height: this.height + 'px',
                'z-index': '2 !important',
                'position': 'relative'
            });
    }

    onMenuPlay() {
        EventManager.fire(Event.RESET_GAME);
        $('.game-ui').hide();
        $('canvas').remove();
        $('.canvas-container').show();
        // show game menu
        var canvas = this.createCanvas();

        $('body .canvas-container').append(canvas);

        this.createContext(canvas);

        EventManager.fire(Event.GAME_READY);
    }

    onReady() {
        // Load assets and start the game
        var that = this;
        AssetManager.loadAssets().then(function () {
            that.loadedAssets = AssetManager.loadedAssets;
            EventManager.fire(Event.GAME_STARTED);
        });
    }

    onStart() {
        this.placeInitialObstacles();
        EventManager.fire(Event.START_GAMELOOP);
    }

    saveGame() {
        // save game to localStorage
        Storage.highscore.set(Math.round(this.score));
        // store game state
        Storage.game.set({ 'game': Game, 'skier': Skier });
    }

    onPaused() {
        this.state.paused = true;
        EventManager.fire(Event.STOP_GAMELOOP);
        // show menu
        $('.canvas-container, .game-start-menu, .game-over-screen').hide();
        $('.game-ui, .game-pause-menu').show();
    }

    onResumed() {
        $('.game-ui').hide();
        $('.canvas-container').show();
        this.state.paused = false;

        var timeLeft = 3;
        var timer = setInterval(() => {
            $('.timer').show();
            $('.timer').html(timeLeft);
            if (timeLeft == 0) {
                clearInterval(timer);
                $('.timer').hide();
                EventManager.fire(Event.START_GAMELOOP);
            }
            timeLeft--;
        }, 1000);
    }

    onGameOver() {
        EventManager.fire(Event.STOP_GAMELOOP);
        this.saveGame();
        $('canvas').remove();
        $('#score').html(this.score + " metres");
        $('.game-start-menu, .game-pause-menu').hide();
        $('.game-ui, .game-over-screen').show();
        EventManager.fire(Event.RESET_GAME);
    }

    onQuit() {
        EventManager.fire(Event.STOP_GAMELOOP);
        this.saveGame();
        $('canvas').remove();
        $('.game-pause-menu, .game-over-screen, .canvas-container').hide();
        $('.game-start-menu').show();
        EventManager.fire(Event.RESET_GAME);
    }

    /**
     * Resets all state properties to their default false
     * @return void
     */
    resetState() {
        for (var state in this.state) {
            this.state[state] = false;
        }
    }

    /**
     * Creates the Canvas Context
     * @param {Canvas} canvas 
     * @return void
     */
    createContext(canvas) {
        this.ctx = canvas[0].getContext('2d');
    }

    /**
     * Clears everything drawn on the canvas
     * @return void
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    /**
    * Randomly places initial obstacles on the map as game loads
    * @return void
    */
    placeInitialObstacles() {
        var numberObstacles = Math.ceil(_.random(5, 7) * (this.width / 800) * (this.height / 500));

        var minX = -50;
        var maxX = this.width + 50;
        var minY = this.height / 2 + 100;
        var maxY = this.height + 50;
        var i = 0;

        for (i = 0; i < numberObstacles; i++) {
            this.placeRandomObstacle(minX, maxX, minY, maxY);
        }

        // console.log(loadedAssets.images)
        var that = this;
        this.obstacles = _.sortBy(this.obstacles, function (obstacle) {
            var obstacleImage = that.loadedAssets.images[obstacle.type];
            return obstacle.y + obstacleImage.height;
        });
    }

    /**
    * Calculates positions that are empty/open on the map
    * @param {int} minX 
    * @param {int} maxX 
    * @param {int} minY 
    * @param {int} maxY 
    * @return {Object} Position of the object
    */
    calculateOpenPosition(minX, maxX, minY, maxY) {
        try {
            // console.log("minX: " + minX + ", maxX: " + maxX + ", minY:" + minY +", maxY: "+ maxY);
            var x = _.random(minX, maxX);
            var y = _.random(minY, maxY);

            var foundCollision = _.find(this.obstacles, function (obstacle) {
                return x > (obstacle.x - 50) && x < (obstacle.x + 50) && y > (obstacle.y - 50) && y < (obstacle.y + 50);
            });

            if (foundCollision) {
                return this.calculateOpenPosition(minX, maxX, minY, maxY);
            }
            else {
                return {
                    x: x,
                    y: y
                }
            }
        } catch (e) {
            // console.log(e);
            return { x: 0, y: 0 };
        }
    }

    /**
     * Finds Open positions and places a new obstacle in those positions
     * @param {int} minX 
     * @param {int} maxX 
     * @param {int} minY 
     * @param {itn} maxY 
     * @return void
     */
    placeRandomObstacle(minX, maxX, minY, maxY) {
        var obstacleIndex = _.random(0, this.obstacleTypes.length - 1);

        var position = this.calculateOpenPosition(minX, maxX, minY, maxY);

        this.obstacles.push({
            type: this.obstacleTypes[obstacleIndex],
            x: position.x,
            y: position.y
        })
    }

    /**
     * Place a single obstacle based on skier direction of movement
     * Endless snow with obstacles illusion
     * @param {Object} skier
     * @return void
     */
    placeNewObstacle(skier) {
        var shouldPlaceObstacle = _.random(1, 8);

        if (shouldPlaceObstacle !== 8) {
            return;
        }

        var leftEdge = skier.mapX;
        var rightEdge = skier.mapX + this.width;
        var topEdge = skier.mapY;
        var bottomEdge = skier.mapY + this.height;

        switch (skier.direction) {
            case 1: // left
                this.placeRandomObstacle(leftEdge - 50, leftEdge, topEdge, bottomEdge);
                break;
            case 2: // left down
                this.placeRandomObstacle(leftEdge - 50, leftEdge, topEdge, bottomEdge);
                this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case 3: // down
                this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case 4: // right down
                this.placeRandomObstacle(rightEdge, rightEdge + 50, topEdge, bottomEdge);
                this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case 5: // right
                this.placeRandomObstacle(rightEdge, rightEdge + 50, topEdge, bottomEdge);
                break;
            case 6: // up
                this.placeRandomObstacle(leftEdge, rightEdge, topEdge - 50, topEdge);
                break;
        }
    }

    /**
     * Draws obstacles
     * @param {Object} skier 
     * @return void
     */
    drawObstacles(skier) {
        var newObstacles = [];

        var that = this;
        _.each(this.obstacles, function (obstacle) {
            var obstacleImage = that.loadedAssets.images[obstacle.type];
            var x = obstacle.x - skier.mapX - obstacleImage.width / 2;
            var y = obstacle.y - skier.mapY - obstacleImage.height / 2;

            if (x < -100 || x > that.width + 50 || y < -100 || y > that.height + 50) {
                return;
            }

            that.ctx.drawImage(obstacleImage, x, y, obstacleImage.width, obstacleImage.height);

            newObstacles.push(obstacle);
        });

        this.obstacles = newObstacles;
    }

    // draw Player Object 
    drawGameObject(skier) {
        var skierAssetName = skier.getAsset();
        var skierImage = this.loadedAssets.images[skierAssetName];
        var x = (this.width - skierImage.width) / 2;
        var y = (this.height - skierImage.height) / 2;

        this.ctx.drawImage(skierImage, x, y, skierImage.width, skierImage.height);
    }

    drawHighScore() {
        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = "#0095DD";
        this.ctx.fillText("Score: " + Math.round(this.score) + " metres", 10, 35);
    }

    drawPauseText() {
        this.ctx.textAlignment = "right";
        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = "#B30D5D";
        this.ctx.fillText("Press P to pause", 500, 35);
    }

};