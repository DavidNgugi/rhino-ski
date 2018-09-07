import utils from './utils';
import EventManager from './EventManager';
import Event from './Event';
import _ from 'lodash';

export default {
    obstacles: {
        types: [
            'tree',
            'treeCluster',
            'rock1',
            'rock2'
        ]
    },
    nearbyObstacles: [],

    /**
     * Checks for collisions between the skier and obstacles
     * @param {Game} Game game instance
     * @param {Object} skier skier object
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

            // var that = this;

            // iterate and check for collisions
            var collision = _.find(Game.obstacles, function(obstacle) {
                
                var obstacleImage = Game.loadedAssets.images[obstacle.type];
                
                var obstacleRect = {
                    left: obstacle.x,
                    right: obstacle.x + obstacleImage.width,
                    top: obstacle.y + obstacleImage.height - 5,
                    bottom: obstacle.y + obstacleImage.height
                };
                
                // console.log(utils.math.intersectRect(playerRect, obstacleRect))
               
                return ( (obstacle.type == 'rock1' || obstacle.type == 'rock2') && player.isJumping) ? false : utils.math.intersectRect(playerRect, obstacleRect);
            });

            if(collision) {
                player.direction = 0;
                player.isMoving = false;
                player.hasCollided = true;
                EventManager.dispatch(Event.GAME_OVER);
            }else{
                if(player.isMoving && !player.isJumping) {
                    EventManager.dispatch(Event.ADD_SCORE);
                }else if(player.isMoving && player.isJumping){
                    EventManager.dispatch(Event.ADD_BONUS_SCORE);
                }
            }
    },

    /**
     * Check if got to ramp so player can jump or fall
     * @param {Game} Game game instance
     * @param {Object} skier skier object
     * @return void
     */
    checkIfSkierHitJumpRamp: function(Game, player){
        var playerRect = utils.getCollisionRect(Game, player);

        var that = this;

        var ramps = _.filter(Game.obstacles, function(obstacle){
            return obstacle.type === 'ramp';
        });

        var collision = _.find(ramps, function(ramp) {
            var obstacleImage = Game.loadedAssets.images[ramp.type];
            var obstacleRect = {
                left: ramp.x,
                right: ramp.x + obstacleImage.width,
                top: ramp.y + obstacleImage.height - 5,
                bottom: ramp.y + obstacleImage.height
            };

            return that.intersectRect(playerRect, obstacleRect);
        });

        if(collision) {
            EventManager.dispatch(Event.FOUND_RAMP);
        }else{
            if(player.isMoving) { 
                EventManager.dispatch(Event.ADD_SCORE);
            }
        }
    },

    /**
     * Check if captured by rhino
     * @param {Game} Game game instance
     * @param {Skier} skier skier object
     * @param {Rhino} rhino rhino object
     * @return void
     */
    checkIfSkierCapturedByEnemy: function(Game, player, rhino){
        var playerRect = utils.getCollisionRect(Game, player);
        var rhinoRect = utils.getCollisionRect(Game, rhino);

        var collision = this.intersectRect(playerRect, rhinoRect);

        if(collision) {
            EventManager.dispatch(Event.GAME_OVER);
        }
    },

    
}