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
            Skier.direction = 5;
            Skier.mapX = 0;
            Skier.mapY = 0;
            Skier.speed = 8;
            Skier.isMoving = false;
            Skier.hasCollided = false;
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
            // prevent moving backwards and ensuring speed is maintained
            if(this.speed > 1){
                this.speed -= 0.5;
                this.isMoving = false;
                this.mapY += this.speed;
            }
        },

        onMoveDown: function(){
            // check speed, accelerate on decent
            if(this.speed < 8){
                this.speed++;
            }
            this.direction = 3;
            this.mapY += this.speed;
        },

        onJump: function(){

        },

    };

    // game utilities
    var utils = {
        toString: function(data){
            return (typeof data === Object) ? JSON.stringify(data) : new Error('Parameter passed is not a JSON object');
        },

        toJson: function(data){
            return (typeof data === 'string') ? JSON.parse(data) : null;
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
            var AssetName = gameObj.getAsset();
            var gameObjImage = game.loadedAssets.images[AssetName];
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
        START_GAMELOOP  : 'START_GAMELOOP',
        STOP_GAMELOOP   : 'STOP_GAMELOOP',
        SHOW_MENU       : 'SHOW_MENU',
        MENU_PLAY       : 'MENU_PLAY',
        HIDE_MENU       : 'HIDE_MENU',
        GAME_READY      : 'GAME_READY',
        GAME_STARTED    : 'GAME_STARTED',
        GAME_PAUSED     : 'GAME_PAUSED',
        GAME_RESUMED    : 'GAME_RESUMED',
        GAME_OVER       : 'GAME_OVER',
        GAME_QUIT       : 'GAME_QUIT',
        RESET_GAME      : 'RESET_GAME',
        RESET_SKIER     : 'RESET_SKIER',
        RESET_RHINO     : 'RESET_RHINO',
        RESET_STORAGE   : 'RESET_STORAGE',
        KEY_LEFT        : 'KEY_LEFT',
        KEY_RIGHT       : 'KEY_RIGHT',
        KEY_DOWN        : 'KEY_DOWN',
        KEY_UP          : 'KEY_UP'
    };

    var registeredEventListeners = [], 
        firedEvents = [];

    var EventManager = {
         /**
         * Registers an event 
         * @param {String} event 
         * @param {Function} handler 
         * @param {Object} target 
         * @returns void
         */
        on: function(event, handler, target) {
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
        var assetPromises = [];

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
            assetPromises.push(assetDeferred.promise());
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
                assetPromises.push(assetDeferred.promise());
            });
        }
        return $.when.apply($, assetPromises);
    }

    // collision detector
    var CollisionDetector = {
        // keep in memory nearby obstacles
        nearbyObstacles: [],
        radiusOfCollision: 50,
        /**
         * Checks for collisions between the skier and obstacles
         * @param {Object} skier
         * @return void
        */
        checkIfSkierHitObstacle: function(Game, player) {
            var playerRect = utils.getCollisionRect(Game, player);

            // filter to nearby obstacles and keep in memory to reduce CPU calc
            // this.nearbyObstacles = _.filter(Game.obstacles, function(obstacle){
            //     var distX = player.mapX - obstacle.x, 
            //         distY = player.mapY - obstacle.y;
            //     return ( distX <= this.radiusOfCollision) && (distY <= this.radiusOfCollision);
            // });

            // console.log(`Nearby obstacles ${this.nearbyObstacles.length}`);

            //  // sort by nearest obstacles
            // _.orderBy(this.nearbyObstacles, ['x','y'], ['asc', 'asc']);

            // console.log(this.nearbyObstacles);

            var that = this;
            // iterate and check for collisions
            var collision = _.find(Game.obstacles, function(obstacle) {
                var obstacleImage = Game.loadedAssets.images[obstacle.type];
                var obstacleRect = {
                    left: obstacle.x,
                    right: obstacle.x + obstacleImage.width,
                    top: obstacle.y + obstacleImage.height - 5,
                    bottom: obstacle.y + obstacleImage.height
                };

                return that.intersectRect(playerRect, obstacleRect);
            });

            if(collision) {
                console.log('Player has collided!');
                player.direction = 0;
                player.isMoving = false;
                player.hasCollided = true;
                EventManager.fire(Event.GAME_OVER);
            }else{
                if(player.isMoving) { 
                    Game.score += 0.5;
                }
            }
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
                var highscore = this.get();
                if(highscore == null){
                    highscore = [];
                }
                highscore.push(value);
                utils.setItem('ceros_highscore', JSON.stringify(highscore));
            },
            get: function(){
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
        width: window.innerWidth,
        height: window.innerHeight,
        obstacleTypes: ['tree', 'treeCluster', 'rock1', 'rock2'],
        obstacles: [],
        loadedAssets: { images: {}, audio: {} },
        score: 0,
        onShowMenu: function(){
            $('.game-ui, .game-start-menu').show();
        },
        onMenuPlay: function(){
            reset();
            $('.game-ui').hide();
            $('canvas').remove();
            $('.canvas-container').show();
             // show game menu
            var canvas = Game.createCanvas();

            $('body .canvas-container').append(canvas);

            Game.createContext(canvas);

            EventManager.fire(Event.GAME_READY)
        },
        createCanvas: function(){
            return $('<canvas></canvas>')
             .attr('width', Game.width * window.devicePixelRatio)
             .attr('height', Game.height * window.devicePixelRatio)
             .css({
                 width: Game.width + 'px',
                 height: Game.height + 'px',
                 'z-index': '2 !important',
                 'position': 'relative'
             });
        },
        onReady: function(){   
            // Load assets and start the game         
            loadAssets().then(function() {
                EventManager.fire(Event.GAME_STARTED)
            });
        },
        onStart: function(){
            Game.placeInitialObstacles();
            animFrame = requestAnimationFrame(gameLoop);
        },
        saveGame: function(){
             // save game to localStorage
             Storage.highscore.set(Math.round(Game.score));
             // store game state
             Storage.game.set({'game': Game, 'skier': Skier, 'rhino': Rhino});
        },
        onPaused: function(){
           Game.saveGame();
           Game.state.paused = true;
           window.cancelAnimationFrame(animFrame);
            // show menu
            $('.canvas-container, .game-start-menu, .game-over-screen').hide();
            $('.game-ui, .game-pause-menu').show();
        },
        onResumed: function(){
            $('.game-ui').hide();
            $('.canvas-container').show();
            Game.state.paused = false;

            var timeLeft = 5;
            var timer = setInterval(() => {
                $('.timer').show();
                $('.timer').html(timeLeft);
                if(timeLeft == 0){
                    clearInterval(timer);
                    $('.timer').hide();
                    animFrame = requestAnimationFrame(gameLoop);
                }
                timeLeft--;
            }, 1000);
        },
        onGameOver: function(){
            Game.saveGame();
            window.cancelAnimationFrame(animFrame);
            $('canvas').remove();
            // show Game Over screen
            $('#score').html(Game.score + " metres");
            $('.game-start-menu, .game-pause-menu').hide();
            $('.game-ui, .game-over-screen').show();
            reset();
        },
        onQuit: function(){
            Game.saveGame();
            window.cancelAnimationFrame(animFrame);
            $('canvas').remove();
            $('.game-pause-menu, .game-over-screen, .canvas-container').hide();
            $('.game-start-menu').show();
            reset();
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
                var obstacleImage = that.loadedAssets.images[obstacle.type];
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
        reset: function(){
            // this.ctx = null; 
            // this.width = window.innerWidth;
            // this.height = window.innerHeight;
            this.loadedAssets = { images: {}, audio: {} };
            this.obstacleTypes = ['tree', 'treeCluster', 'rock1', 'rock2'];
            this.obstacles = [];
            this.score = 0;
        }
    };

    var animFrame = null;

    // reset game
    var reset = function(){
        animFrame = null;
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
        Skier.move();

        Game.placeNewObstacle(Skier);

        // draw highscore
        drawHighScore();

        // draw skier
        drawGameObject(Skier);

        // drawGameObject(Rhino);
        
        Game.drawObstacles(Skier);

        // check for collisions
        CollisionDetector.checkIfSkierHitObstacle(Game, Skier);
        // CollisionDetector.checkIfSkierCapturedByEnemy(Game, Skier, Rhino);

        // restore ctx
        Game.ctx.restore();

        // update game
        if(animFrame != null && Game.state.paused == false){
            animFrame = requestAnimationFrame(gameLoop);
        }
    };

    /**
     * Checks for keyboard onKeyDown events
     * @param {int} update 
     * @return void
     */
    var setupKeyhandler = function(){
        $(document).keydown(function(event) {

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
                case 80:
                    EventManager.fire(Event.GAME_PAUSED);
                    break;
            }
        });
    };

    /**
     * Game Event Listeners registration
     */
    var registerEvents = function(){
        EventManager.on(Event.RESET_GAME, Game.onReset);
        EventManager.on(Event.RESET_SKIER, Skier.reset);
        EventManager.on(Event.RESET_Rhino, Rhino.reset);
        EventManager.on(Event.RESET_STORAGE, Storage.game.clear);
        EventManager.on(Event.SHOW_MENU, Game.onShowMenu);
        EventManager.on(Event.MENU_PLAY, Game.onMenuPlay);
        EventManager.on(Event.GAME_READY, Game.onReady);
        EventManager.on(Event.GAME_STARTED, Game.onStart);
        EventManager.on(Event.GAME_PAUSED, Game.onPaused);
        EventManager.on(Event.GAME_RESUMED, Game.onResumed);
        EventManager.on(Event.GAME_OVER, Game.onGameOver);
        EventManager.on(Event.GAME_QUIT, Game.onQuit);
        EventManager.on(Event.KEY_LEFT, Skier.onMoveLeft);
        EventManager.on(Event.KEY_RIGHT, Skier.onMoveRight);
        EventManager.on(Event.KEY_DOWN, Skier.onMoveDown);
        EventManager.on(Event.KEY_UP, Skier.onMoveUp);
    };

    /**
     *  DOM Event listeners
    */

    // Play/New Game
    $('.play').on('click', function(e){
        EventManager.fire(Event.MENU_PLAY);
    });

    // Resume Game
    $('#resume').on('click', function(e){
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
        var highscores = Storage.highscore.get();
        if(highscores != undefined || highscores != null){
            $('#highscores li').remove();
            highscores.sort(((a,b) => { return b-a;})).forEach((highscore) => {
                $('#highscores').append('<li> '+highscore+' metres</li>');
            });
        }
        $('.highscore-screen').show();
    });
      
    /**
     * Setup the game
     */
    var setup = function(){
        // register all game events first
        registerEvents();  
        EventManager.fire(Event.SHOW_MENU);
        setupKeyhandler();
    };

    setup();



});