import utils from './utils';

/**
 * The player component
 */
export default {
    direction: 5,
    mapX: 0,
    mapY: 0,
    speed: 8,
    isMoving: false,
    hasCollided: false,
    assets: ['skierCrash', 'skierLeft', 'skierLeftDown', 'skierDown', 'skierRightDown', 'skierRight'],

    getAsset: function(){
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

    getData: function(){
        return {
            x: this.mapX,
            y: this.mapY,
            direction: this.direction,
            speed: this.speed,
            isMoving: this.isMoving,
            hasCollided: this.hasCollided
        }
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
    
    onMoveUp: function(){
        // prevent moving backwards and ensuring speed is maintained
        if(this.speed > 1){
            this.speed -= 0.5;
            this.isMoving = false;
            this.mapY += this.speed;
        }
    },


    onJump: function(){
        
    },

};
