
import Event from './Event';
import EventManager from './EventManager';
import Storage from './Storage';
import Game from './Game';
import CollisionDetector from './CollisionDetector';
import Skier from './Skier';
// import Rhino from './Rhino';

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

$(document).ready(function() {

    var animFrame = null;

    var game = new Game();

    var onStartGameLoop = function(){
        animFrame = requestAnimationFrame(gameLoop);
    };

    var onStopGameLoop = function(){
        window.cancelAnimationFrame(animFrame);
    };

    // var onStart = function(){
    //     game.placeInitialObstacles();
    //     EventManager.fire(Event.START_GAMELOOP);
    // }

    /**
     * GameLoop
     */
    var gameLoop = function(){
        // save ctx
        game.ctx.save();

        // Retina support
        game.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        
        // clear the canvas
        game.clearCanvas();

        // draw relevant stuff
        Skier.move();

        game.placeNewObstacle(Skier);

        // draw highscore
        game.drawHighScore();

        // draw Skier
        game.drawGameObject(Skier);

        // drawGameObject(Rhino);
        
        game.drawObstacles(Skier);

        // check for collisions
        CollisionDetector.checkIfSkierHitObstacle(Game, Skier);
        // CollisionDetector.checkIfSkierCapturedByEnemy(Game, Skier, Rhino);

        // restore ctx
        game.ctx.restore();

        // update game
        if(animFrame != null && game.state.paused == false){
            animFrame = requestAnimationFrame(gameLoop);
        }
    };

    /**
     * Game Event Listeners registration
     */
    var registerEvents = function(){
        EventManager.on(Event.RESET_GAME, game.onReset, game);
        EventManager.on(Event.RESET_SKIER, Skier.reset, Skier);
        // EventManager.on(Event.RESET_RHINO, Rhino.reset, Rhino);
        EventManager.on(Event.RESET_STORAGE, Storage.game.clear, Storage);

        EventManager.on(Event.START_GAMELOOP, onStartGameLoop, this);
        EventManager.on(Event.STOP_GAMELOOP, onStopGameLoop, this);

        EventManager.on(Event.SHOW_MENU, game.onShowMenu, game);
        EventManager.on(Event.MENU_PLAY, game.onMenuPlay, game);

        EventManager.on(Event.GAME_READY, game.onReady, game);
        EventManager.on(Event.GAME_STARTED, game.onStart, game);
        EventManager.on(Event.GAME_PAUSED, game.onPaused, game);
        EventManager.on(Event.GAME_RESUMED, game.onResumed, game);
        EventManager.on(Event.GAME_OVER, game.onGameOver, game);
        EventManager.on(Event.GAME_QUIT, game.onQuit, game);

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
        console.log(highscores);
        if(highscores != undefined || highscores != null){
            $('#highscores li').remove();
            highscores.sort(((a,b) => { return b-a;})).forEach((highscore) => {
                $('#highscores').append('<li> '+highscore+' metres</li>');
            });
        }
        $('.highscore-screen').show();
    });

    /**
     * Checks for keyboard onKeyDown events
     * @param {int} update 
     * @return void
     */
    var setupKeyHandler = function(){
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
     * Setup the game
     */
    var setup = function(){
        registerEvents();  
        EventManager.fire(Event.SHOW_MENU);
        setupKeyHandler();
    };

    setup();

});