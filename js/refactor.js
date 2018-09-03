// 'use strict';

$(document).ready(function() {

    // Ensure compatibility across browsers
    var requestAnimationFrame = (function(){
        return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                window.oRequestAnimationFrame      ||
                window.msRequestAnimationFrame     ||
                function(callback, element){
                window.setTimeout(callback, 1000 / 60);
                };
    })();

    // game assets
    var assets = {
        images : {
            'skierCrash'            : 'img/skier_crash.png',
            'skierLeft'             : 'img/skier_left.png',
            'skierLeftDown'         : 'img/skier_left_down.png',
            'skierDown'             : 'img/skier_down.png',
            'skierRightDown'        : 'img/skier_right_down.png',
            'skierRight'            : 'img/skier_right.png',
            'skierJump1'            : 'img/skier_jump_1.png',
            'skierJump2'            : 'img/skier_jump_2.png',
            'skierJump3'            : 'img/skier_jump_3.png',
            'skierJump4'            : 'img/skier_jump_4.png',
            'skierJump5'            : 'img/skier_jump_5.png',
            'rhinoDefault'          : 'img/rhino_default.png',
            'rhinoLiftEat1'         : 'img/rhino_lift_eat_1.png',
            'rhinoLiftEat2'         : 'img/rhino_lift_eat_2.png',
            'rhinoLiftEat3'         : 'img/rhino_lift_eat_3.png',
            'rhinoLiftEat4'         : 'img/rhino_lift_eat_4.png',
            'rhinoLiftMouthOpen'    : 'img/rhino_lift_mouth_open.png',
            'rhinoLift'             : 'img/rhino_lift.png',
            'rhinoLeft'             : 'img/rhino_run_left.png',
            'rhinoLeft2'            : 'img/rhino_run_left_2.png',
            'tree'                  : 'img/tree_1.png',
            'treeCluster'           : 'img/tree_cluster.png',
            'rock1'                 : 'img/rock_1.png',
            'rock2'                 : 'img/rock_2.png'
        },
        audio: {}
    };

    // Assets that have been loaded already
    // var loadedAssets = { images: [], audio: [] };

    // obstacles
    var obstacles = {
        types: [
            'tree',
            'treeCluster',
            'rock1',
            'rock2'
        ]
    };

    var Rhino = {
        mapX: 0,
        mapY: 0,
        speed: 8,
        isMoving: false,
        hasCollided: false,
    };

    var Skier = {
        direction: 5,
        mapX: 0,
        mapY: 0,
        speed: 8,
        isMoving: false,
        hasCollided: false,
        assets: ['skierCrash', 'skierLeft', 'skierLeftDown', 'skierDown', 'skierRightDown', 'skierRight'],

        getAsset(){        
            return this.assets[this.direction];
        },

        /**
         * Resets properties to default
         * @return void
         */
        reset: function(){
            this.direction = 5;
            this.mapX = 0;
            this.mapY = 0;
            this.speed = 8;
            this.isMoving = false;
            this.hasCollided = false;
        },

        /**
         * Moves the skier according to the direction and places new objects on the map
         * @return void
         */
        move: function() {
            var dt = 1;
            switch(this.direction) {
                case 2:
                    this.mapX = utils.math.lerp(this.mapX, (this.mapX - Math.round(this.speed / 1.4142)), dt);
                    this.mapY = utils.math.lerp(this.mapY, (this.mapY + Math.round(this.speed / 1.4142)), dt);
                    break;
                case 3:
                    this.mapY = utils.math.lerp(this.mapY, (this.mapY + this.speed), dt);
                    break;
                case 4:
                    this.mapX = utils.math.lerp(this.mapX, (this.mapX + this.speed / 1.4142), dt);
                    this.mapY = utils.math.lerp(this.mapY, (this.mapY + this.speed / 1.4142), dt);
                    break;

            }
        },

        onMoveLeft: function(){
            if(this.direction === 0)
                this.direction = 1;
            else
                this.direction = 2;
            
                this.mapX += this.speed;
        },

        onMoveRight: function(){
            if(this.direction === 0)
                this.direction = 5;
            else
                this.direction = 4;

            this.mapX += this.speed;
        },

        onMoveUp: function(){
            // this.mapY-= this.speed;
            this.speed -= 0.5;
            this.isMoving = false;
            this.mapY += this.speed;
        },

        onMoveDown: function(){
            this.direction = 3;
            this.mapY += this.speed;
        }

    };

    // game utilities
    var utils = {
        toString: function(data){
            return (typeof data === Object) ? JSON.stringify(data) : new Error('Parameter passed is not a JSON object');
        },

        toJson: function(data){
            return (typeof data === String) ? JSON.parse(data) : null;
        },

        setItem: function(key, value){
            if (window && window.localStorage || window.sessionStorage) {
                window.sessionStorage.setItem(key, value) || window.localStorage.setItem(key, value);
            }
        },
        
        getItem: function(key) {
            var data = null;
            if (window && window.localStorage || window.sessionStorage) {
                data = window.sessionStorage.getItem(key) || window.localStorage.getItem(key);
            }
            return data;
        },
    
        removeItem: function(key){
            if (window && window.localStorage || window.sessionStorage) {
                window.sessionStorage.removeItem(key) || window.localStorage.removeItem(key);
            }
        },
    
        clearAll: function(){
            if (window && window.localStorage || window.sessionStorage) {
                window.sessionStorage.clear() || window.localStorage.clear();
            }
        },

        getCollisionRect: function(game, gameObj){
            var AssetName = gameObj.asset;
            var gameObjImage = game.oadedAssets.images[AssetName];
            var collisionRect = {
                left: gameObj.mapX + game.width / 2,
                right: gameObj.mapX + gameObjImage.width + game.width / 2,
                top: gameObj.mapY + gameObjImage.height - 5 + game.height / 2,
                bottom: gameObj.mapY + gameObjImage.height + game.height / 2
            };

            return collisionRect;
        },

        math: {
             /**
             * Linear Interpolation
             * @param {int} current 
             * @param {int} goal 
             * @param {int} dt 
             */
            lerp : function(current, goal, dt){
                return current + (goal-current) * dt;
            }
        }
    };

    // set all game events enum. values are arbitrary
    var Event = {
        SHOW_MENU: 'SHOW_MENU',
        HIDE_MENU: 'HIDE_MENU',
        GAME_STARTED: 'GAME_STARTED',
        GAME_PAUSED: 'GAME_PAUSED',
        GAME_RESUMED: 'GAME_RESUMED',
        GAME_OVER: 'GAME_OVER',
        GAME_QUIT: 'GAME_QUIT',
        KEY_LEFT: 'KEY_LEFT',
        KEY_RIGHT: 'KEY_RIGHT',
        KEY_DOWN: 'KEY_DOWN',
        KEY_UP: 'KEY_UP'
    };

    var registeredEventListeners = [], 
        firedEvents = [];

    var EventManager = {
        on: function(event, handler, target) {
            // console.log(handler);
            if (!target) {
                target = arguments.callee.caller;
            }
            // check if event already exists
            if (!registeredEventListeners[event]) {
                registeredEventListeners[event] = [];
            }
            //register event
            registeredEventListeners[event].push({handler: handler, target: target});
        },

        fire: function(event){
            // var name = typeof event == 'string' ? event : utils.getInstanceName(event);

            // console.log(registeredEventListeners[event]);
            var listeners = this.getListeners(event);
            
            for(var i = 0; i < listeners.length; i++){
                var listener = listeners[i].target;
                listeners[i].handler.call(listener, listeners[i].target);
                // firedEvents[event].push({handler: listeners[i].handler, target: listeners[i].target});
            }
        },

        /**
         * @param Object event
         */
        getListeners: function(event) {
            // var name = typeof event == 'string' ? event: utils.getInstanceName(event);
            if (!registeredEventListeners[event]) {
                registeredEventListeners[event] = [];
            }

            return registeredEventListeners[event];
        },

        reset: function(){
            registeredEventListeners = [];
            firedEvents = [];
        }
    };


    /**
     * Asynchronously Load each asset from Asset Store 
     * @return {Promise}
     */
    var loadAssets = function() {
        var assetPromises = { images: [], audio: []};

        // var context = this;

        var count = assets.images.length + assets.audio.length;

        var loaded = 0;

        // load images
        _.each(assets.images, function(asset, assetName) {

            var assetImage = new Image();
            var assetDeferred = new $.Deferred();

            // var that = context;
            assetImage.onload = function() {
                assetImage.width /= 2;
                assetImage.height /= 2;
                Game.loadedAssets.images[assetName] = assetImage;
                
                assetDeferred.resolve();
            };
            assetImage.src = asset;
            loaded++;
            assetPromises.images.push(assetDeferred.promise());
        });

        if(assets.audio.length > 0){
        // load the audio too
            _.each(assets.audio, function(asset, assetName) {

                var assetAudio = new Audio();
                var assetDeferred = new $.Deferred();

                // var that = context;
                assetAudio.onload = function() {
                    Game.loadedAssets.audio[assetName] = assetAudio;
                    assetDeferred.resolve();
                };
                assetAudio.src = asset;
                loaded++;
                assetPromises.audio.push(assetDeferred.promise());
            });
        }

        console.log("Loaded "+ loaded + " Assets so far");
        return $.when.apply($, assetPromises);
    }

    // collision detector
    var collisionDetector = {
        /**
         * Checks for collisions between the skier and obstacles
         * @param {Object} skier
         * @return void
        */
        checkIfSkierHitObstacle: function(Game, player) {
            var playerRect = utils.getCollisionRect(Game, player);

            var that = this;
            _.find(obstacles, function(obstacle) {
                var obstacleImage = Game.loadedAssets[obstacle.type];
                var obstacleRect = {
                    left: obstacle.x,
                    right: obstacle.x + obstacleImage.width,
                    top: obstacle.y + obstacleImage.height - 5,
                    bottom: obstacle.y + obstacleImage.height
                };

                return that.intersectRect(playerRect, obstacleRect);
            });
        },

        checkIfSkierCapturedByEnemy: function(Game, player, rhino){
            var playerRect = utils.getCollisionRect(Game, player);
            var rhinoRect = utils.getCollisionRect(Game, rhino);

            return this.intersectRect(playerRect, rhinoRect);
        },

        intersectRect: function(r1, r2) {
            return !(r2.left > r1.right ||
                r2.right < r1.left ||
                r2.top > r1.bottom ||
                r2.bottom < r1.top);
        }
    };

    // draw Game Objects
    // var drawGameObjects = function(){

    // };

    // draw Player Object 
    var drawGameObject = function(player){
        var playerAssetName = player.getAsset();
        var playerImage = Game.loadedAssets.images[playerAssetName];
        var x = (Game.width - playerImage.width) / 2;
        var y = (Game.height - playerImage.height) / 2;

        Game.ctx.drawImage(playerImage, x, y, playerImage.width, playerImage.height);
    };

    // storage stuff
    var Storage = {
        // highscore stuff
        highscore: {
            set: function(value){
                utils.setItem('ceros_highscore', value);
            },
            get: function(){
                return utils.getItem('ceros_highscore');
            },
            getJson: function(){
                return utils.toJson(utils.getItem('ceros_highscore'));
            }
        },
        // game data
        game: {
            clear: function(){
                utils.removeItem('ceros_game_data');
            },
            set: function(data){
                utils.setItem('ceros_game_data)', JSON.stringify(data));
            },
            get: function(){
                return utils.toJson(utils.getItem('ceros_game_data'));
            }
        }
    };

    // draw the high score
    var drawHighScore = function(){
        Game.ctx.font = "30px Arial";
        Game.ctx.fillStyle = "#0095DD";
        Game.ctx.fillText("Score: "+ Math.round(Game.score) + " metres", 10, 35);
    };

    // main game instance
    var Game = {
        ctx: null,
        state: { 'started': false, 'paused': false, 'resumed': false, 'gameOver': false},
        width: window.innerWidth,
        height: window.innerHeight,
        obstacleTypes: ['tree', 'treeCluster', 'rock1', 'rock2'],
        obstacles: [],
        loadedAssets: { images: [], audio: [] },
        score: 0,
        getCurrentState: function(){
            var currentState;
            for(var state in Game.state){
                if(Game.state[state])
                    currentState = state;
            }
            
            return (currentState !== undefined) ? currentState : 'started';
        },
        onMenuShow: function(){
            
             // show game menu
            var canvas = $('<canvas></canvas>')
             .attr('width', Game.width * window.devicePixelRatio)
             .attr('height', Game.height * window.devicePixelRatio)
             .css({
                 width: Game.width + 'px',
                 height: Game.height + 'px',
                 'z-index': '1 !important'
             });

            // var pause_button = $("<button></button>")
            //     .attr('class', 'pause button')
            //     .attr('width', 200 * window.devicePixelRatio)
            //     .attr('height', 100 * window.devicePixelRatio)
            //     .css({
            //         'position': 'absolute !important',
            //         'z-index': '2 !important'
            //     })
            //     .html('Pause Game');

            $('body .canvas-container').append(canvas);
            // $('body .canvas-container').append(pause_button);

            Game.createContext(canvas);

            // console.log(Game);

            EventManager.fire(Event.GAME_READY)
        },
        onReady: function(){
            // console.log(assets)
            
            loadAssets().then(function() {
                EventManager.fire(Event.GAME_STARTED)
            });
        },
        onStart: function(){
            reset();
            setupKeyhandler();
            Game.placeInitialObstacles();
            requestAnimationFrame(gameLoop);
        },
        onPaused: function(){
            // save game to localStorage
            Storage.highscore.set(Math.round(Game.score));
            // store game state
            Storage.game.set({'game': Game, 'skier': Skier, 'rhino': Rhino});
            // show menu
            // pauseAndShowPausedGameUI();
        },
        onResumed: function(){
            $('.game-ui').hide();
        },
        onGameOver: function(){

        },
        onQuit: function(){
            reset();
            $('.game-pause-menu').hide();
            $('.game-start-menu').show();
        },
        /**
         * Resets all state properties to their default false
         * @return void
         */
        resetState: function(){
            for(var state in Game.state){
                Game.state[state] = false;
            }
        },

        /**
         * Creates the Canvas Context
         * @param {Canvas} canvas 
         * @return void
         */
        createContext: function(canvas) {
            Game.ctx = canvas[0].getContext('2d');
        },

        /**
         * Clears everything drawn on the canvas
         * @return void
         */
        clearCanvas: function() {
            Game.ctx.clearRect(0, 0, Game.width, Game.height);
        },

         /**
         * Randomly places initial obstacles on the map as game loads
         * @return void
         */
        placeInitialObstacles: function(){
            var numberObstacles = Math.ceil(_.random(5, 7) * (Game.width / 800) * (Game.height / 500));

            var minX = -50;
            var maxX = Game.width + 50;
            var minY = Game.height / 2 + 100;
            var maxY = Game.height + 50;
            var i = 0;

            for(i = 0; i < numberObstacles; i++) {
                this.placeRandomObstacle(minX, maxX, minY, maxY);
            }

            // console.log(loadedAssets.images)
            var that = this;
            this.obstacles = _.sortBy(this.obstacles, function(obstacle) {
                var obstacleImage = that.loadedAssets.images[obstacle.type];
                return obstacle.y + obstacleImage.height;
            });
        },

         /**
         * Calculates positions that are empty/open on the map
         * @param {int} minX 
         * @param {int} maxX 
         * @param {int} minY 
         * @param {int} maxY 
         * @return {Object} Position of the object
         */
        calculateOpenPosition: function(minX, maxX, minY, maxY) {
            try{
                // console.log("minX: " + minX + ", maxX: " + maxX + ", minY:" + minY +", maxY: "+ maxY);
                    var x = _.random(minX, maxX);
                    var y = _.random(minY, maxY);
                
                var foundCollision = _.find(this.obstacles, function(obstacle) {
                    return x > (obstacle.x - 50) && x < (obstacle.x + 50) && y > (obstacle.y - 50) && y < (obstacle.y + 50);
                });

                if(foundCollision) {
                    return this.calculateOpenPosition(minX, maxX, minY, maxY);
                }
                else {
                    return {
                        x: x,
                        y: y
                    }
                }
            }catch(e){
                // console.log(e);
                return { x: 0, y: 0};
            }
        },

        /**
         * Finds Open positions and places a new obstacle in those positions
         * @param {int} minX 
         * @param {int} maxX 
         * @param {int} minY 
         * @param {itn} maxY 
         * @return void
         */
        placeRandomObstacle: function(minX, maxX, minY, maxY) {
            var obstacleIndex = _.random(0, Game.obstacleTypes.length - 1);

            var position = Game.calculateOpenPosition(minX, maxX, minY, maxY);

            Game.obstacles.push({
                type : this.obstacleTypes[obstacleIndex],
                x : position.x,
                y : position.y
            })
        },

        /**
         * Place a single obstacle based on skier direction of movement
         * Endless snow with obstacles illusion
         * @param {Object} skier
         * @return void
         */
        placeNewObstacle: function(skier) {
            var shouldPlaceObstacle = _.random(1, 8);
            if(shouldPlaceObstacle !== 8) {
                return;
            }

            var leftEdge = skier.mapX;
            var rightEdge = skier.mapX + Game.width;
            var topEdge = skier.mapY;
            var bottomEdge = skier.mapY + Game.height;

            switch(skier.direction) {
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
        },

        /**
         * Draws obstacles
         * @param {Object} skier 
         * @return void
         */
        drawObstacles: function(skier) {
            var newObstacles = [];

            var that = this;
            _.each(this.obstacles, function(obstacle) {
                var obstacleImage = this.loadedAssets.images[obstacle.type];
                var x = obstacle.x - skier.mapX - obstacleImage.width / 2;
                var y = obstacle.y - skier.mapY - obstacleImage.height / 2;

                if(x < -100 || x > that.width + 50 || y < -100 || y > that.height + 50) {
                    return;
                }

                that.ctx.drawImage(obstacleImage, x, y, obstacleImage.width, obstacleImage.height);

                newObstacles.push(obstacle);
            });

            this.obstacles = newObstacles;
        },
         /**
         * Resets properties to default
         * @return void
         */
        reset: () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.loadedAssets = { images: {}, audio: {} };
            this.obstacleTypes = ['tree', 'treeCluster', 'rock1', 'rock2'];
            this.obstacles = [];
            this.state = { 'started': false, 'paused': false, 'resumed': false, 'gameOver': false};
            this.score= 0;
        }
    };

    // create canvas
    var createCanvas = function(width, height) {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    };

    // reset game
    var reset = function(){
        Storage.game.clear();
        Game.reset();
        Skier.reset();
        // Rhino.reset();
    };

    // gameloop
    var gameLoop = function(){
        // save ctx
        Game.ctx.save();

        // Retina support
        Game.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        
        // clear the canvas
        Game.clearCanvas();

        // draw relevant stuff
        // Skier.move();

        // check for collisions
        // collisionDetector.checkIfSkierHitObstacle(Game, Skier);
        // collisionDetector.checkIfSkierCapturedByEnemy(Game, Skier, Rhino);

        // draw highscore
        drawHighScore();

        // draw skier
        drawGameObject(Skier);

        // restore ctx
        Game.ctx.restore();

        // update game
        requestAnimationFrame(gameLoop);
    };

    /**
     * Checks for keyboard onKeyDown events
     * @param {int} update 
     * @return void
     */
    var setupKeyhandler = function(){
        $(document).keydown(function(event) {
            // var now = Date.now();
            // delta = (now - then)/10000;
            Skier.isMoving = true;

            event.preventDefault();

            switch(event.which) {
                case 37: // left
                    EventManager.fire(Event.KEY_LEFT);
                    break;
                case 39: // right
                    EventManager.fire(Event.KEY_RIGHT);
                    break;
                case 38: // up
                    EventManager.fire(Event.KEY_UP);
                    break;
                case 40: // down
                    EventManager.fire(Event.KEY_DOWN);
                    break;
            }
        });
    };

    /**
     * Game Event Listeners registration
     */
    var registerEvents = function(){
        EventManager.on(Event.SHOW_MENU, Game.onMenuShow);
        EventManager.on(Event.GAME_READY, Game.onReady);
        EventManager.on(Event.GAME_STARTED, Game.onStart);
        EventManager.on(Event.GAME_PAUSED, Game.onPaused);
        EventManager.on(Event.GAME_RESUMED, Game.onResumed);
        EventManager.on(Event.GAME_OVER, Game.onGameOver);
        EventManager.on(Event.GAME_QUIT, Game.onQuit);

        EventManager.on(Event.KEY_LEFT, Skier.onMoveLeft, Skier);
        EventManager.on(Event.KEY_RIGHT, Skier.onMoveRight, Skier);
        EventManager.on(Event.KEY_DOWN, Skier.onMoveDown, Skier);
        EventManager.on(Event.KEY_UP, Skier.onMoveUp, Skier);
    };

    /**
     *  DOM Event listeners
    */

    // Play/New Game
    $('.play').on('click', function(e){
        $('.game-ui').hide();
        EventManager.fire(Event.SHOW_MENU);
    });

    // Resume Game
    $('#resume').on('click', function(e){
        // var then = Date.now();
        // resumeGame(then);
        EventManager.fire(Event.GAME_RESUMED);
    });

    // Pause Game
    $('.pause').on('click', function(e){
        e.preventDefault();
        EventManager.fire(Event.GAME_PAUSED);
    });

    // Quit game
    $("#quit").on('click', function(e){
        EventManager.fire(Event.GAME_QUIT);
    });

    // Go Back to Main Menu
    $('.back').on('click', function(e){
        $('.highscore-screen,.game-over-screen').hide();
        $('.game-start-menu').show();
    });

    // View High Scores
    $('#highscore').on('click', function(e){
        $('.game-start-menu').hide();
        var highscores = Storage.highscore.getJson();
        // console.log(highscores);
        if(highscores != undefined || highscores != null){
            $('#highscores li').remove();
            highscores.sort(((a,b) => { return b-a;})).forEach((highscore) => {
                $('#highscores').append('<li> '+highscore+' metres</li>');
            });
        }
        $('.highscore-screen').show();
    });

      
    // setup game
    var setup = function(){
         // check game state before initializing anything else
        if(Game.getCurrentState() === 'started'){
            console.log('not started. fire away then');
            $('.game-ui, .game-start-menu').show();
            EventManager.fire(Event.SHOW_MENU);
        }else if(Game.getCurrentState() === 'paused'){
            // pauseAndShowPausedGameUI();
            EventManager.fire(Event.GAME_PAUSED);
        }else{
            // gameOver();
            EventManager.fire(Event.GAME_OVER);
        }
        
        registerEvents();      
    };

    setup();



});