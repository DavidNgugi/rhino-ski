import utils from './utils';

export default {
    obstacles: {
        types: [
            'tree',
            'treeCluster',
            'rock1',
            'rock2'
        ]
    },
    // keep in memory nearby obstacles
    nearbyObstacles: [],
    /**
     * Checks for collisions between the skier and obstacles
     * @param {Object} skier
     * @return void
    */
    checkIfSkierHitObstacle: function(Game, player) {
        var playerRect = utils.getCollisionRect(Game, player);

        var that = this;

        // // filter to nearby obstacles and keep in memory to reduce CPU calc
        // this.nearbyObstacles = _.filter(Game.obstacles, function(obstacle){
        //     var distX = player.mapX - obstacle.x, 
        //         distY = player.mapY - obstacle.y;
        //     return (distX > player.mapX && distX < 10) && (distY > player.mapY && distY < 10);
        // });

        // // sort by nearest obstacles
        // _.orderBy(this.nearbyObstacles, ['x','y'], ['asc', 'asc']);

        // console.log(this.nearbyObstacles);
        
        // iterate and check for collisions
        _.forEach(Game.obstacles, function(obstacle) {
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

    /**
     * 
     */
    checkIfSkierHitJumpRamp: function(Game, player){
        var playerRect = utils.getCollisionRect(Game, player);

        var that = this;
        var ramps = _.filter(obstacles, function(obstacle){
            return obstacle.type === 'ramp';
        });

        _.find(ramps, function(ramp) {
            var obstacleImage = Game.loadedAssets['ramp'];
            var obstacleRect = {
                left: obstacle.x,
                right: obstacle.x + obstacleImage.width,
                top: obstacle.y + obstacleImage.height - 5,
                bottom: obstacle.y + obstacleImage.height
            };

            return that.intersectRect(playerRect, obstacleRect);
        });
    },

    /**
     * 
     */
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
}