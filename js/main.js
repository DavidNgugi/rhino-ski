
import Event from './Event';
import EventManager from './EventManager';
import Storage from './Storage';
import Game from './Game';
import CollisionDetector from './CollisionDetector';
import Skier from './Skier';
// import Rhino from './Rhino';

// Ensure compatibility across browsers
var requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback, element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

$(document).ready(function () {

    var animFrame = null;

    var game = new Game(window.innerWidth, window.innerHeight);

    var onStartGameLoop = function () {
        animFrame = requestAnimationFrame(gameLoop);
    };

    var onStopGameLoop = function () {
        window.cancelAnimationFrame(animFrame);
    };

    var onAddScore = function(){
        game.score += 0.5;
    };

    var onAddBonusScore = function(){
        game.score += 2;
    };

    var foundRamp = function () {}

    var gameLoop = function () {
        game.ctx.save();

        // Retina support
        game.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        game.clearCanvas();

        Skier.move();

        game.placeNewObstacle(Skier);

        game.drawInfo();

        game.drawGameObject(Skier);

        game.drawObstacles(Skier);

        CollisionDetector.checkIfSkierHitObstacle(game, Skier);

        // CollisionDetector.checkIfSkierCapturedByEnemy(game, Skier, Rhino);

        game.updateSpeed(Skier);

        game.ctx.restore();

        if (animFrame != null && !game.state.paused) {
            animFrame = requestAnimationFrame(gameLoop);
        }
    };

    var registerEvents = function () {
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
        EventManager.on(Event.FOUND_RAMP, foundRamp, this);
        EventManager.on(Event.PLAYER_JUMP, Skier.onJump, Skier);
        EventManager.on(Event.ADD_SCORE, onAddScore, this);
        EventManager.on(Event.ADD_BONUS_SCORE, onAddBonusScore, this);

        EventManager.on(Event.KEY_LEFT, Skier.onMoveLeft, Skier);
        EventManager.on(Event.KEY_RIGHT, Skier.onMoveRight, Skier);
        EventManager.on(Event.KEY_DOWN, Skier.onMoveDown, Skier);
        EventManager.on(Event.KEY_UP, Skier.onMoveUp, Skier);
    };

    $('.play').on('click', function (e) {
        EventManager.dispatch(Event.MENU_PLAY);
    });

    $('#resume').on('click', function (e) {
        EventManager.dispatch(Event.GAME_RESUMED);
    });

    $('.pause').on('click', function (e) {
        e.preventDefault();
        EventManager.dispatch(Event.GAME_PAUSED);
    });

    $("#quit").on('click', function (e) {
        EventManager.dispatch(Event.GAME_QUIT);
    });

    // Go Back to Main Menu
    $('.back').on('click', function (e) {
        $('.highscore-screen,.game-over-screen').hide();
        $('.game-start-menu').show();
    });

    // View High Scores
    $('#highscore').on('click', function (e) {
        $('.game-start-menu').hide();
        var highscores = Storage.highscore.get();
        if (highscores != undefined || highscores != null) {
            $('#highscores li').remove();
            highscores.sort(((a, b) => { return b - a; })).forEach((highscore) => {
                $('#highscores').append('<li> ' + highscore + ' metres</li>');
            });
        }
        $('.highscore-screen').show();
    });

    /**
     * Checks for keyboard onKeyDown events
     * @return void
     */
    var setupKeyHandler = function () {
        $(document).keydown(function (event) {

            event.preventDefault();

            if(event.which == 37 || event.which == 38 || event.which == 39 || event.which == 40){
                Skier.isMoving = true;
            }

            switch (event.which) {
                case 37: // left
                    EventManager.dispatch(Event.KEY_LEFT);
                    break;
                case 39: // right
                    EventManager.dispatch(Event.KEY_RIGHT);
                    break;
                case 38: // up
                    EventManager.dispatch(Event.KEY_UP);
                    break;
                case 40: // down
                    EventManager.dispatch(Event.KEY_DOWN);
                    break;
                case 80: // P
                    if (!game.state.pause) {
                        EventManager.dispatch(Event.GAME_PAUSED);
                    }
                    break;
                case 32: // space
                    if(Skier.direction == 3){
                        EventManager.dispatch(Event.PLAYER_JUMP);
                    }
                    break;
            }
        });
    };

    /**
     * Setup the game
     */
    var setup = function () {
        registerEvents();
        EventManager.dispatch(Event.SHOW_MENU);
        setupKeyHandler();
    };

    setup();

});