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
    assets: [
        'skierCrash', 
        'skierLeft', 
        'skierLeftDown', 
        'skierDown', 
        'skierRightDown', 
        'skierRight', 
        'skierJump1',
        'skierJump2',
        'skierJump3',
        'skierJump4',
        'skierJump5'
    ],
    animSequence: [6, 7, 8, 9, 10],

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
        this.isJumping = false;
    },

    getData: function(){
        return {
            x: this.mapX,
            y: this.mapY,
            direction: this.direction,
            speed: this.speed,
            isMoving: this.isMoving,
            hasCollided: this.hasCollided,
            isJumping: this.isJumping
        }
    },

    /**
     * Moves the skier according to the direction and places new objects on the map
     * @return void
     */
    move: function() {
        // if(this.isJumping === false){
            var dt = 1;

            if(this.direction == 6 || this.direction == 7 || this.direction == 8 || this.direction == 9 || this.direction == 10){
                this.mapY = utils.math.lerp(this.mapY, (this.mapY + this.speed), dt);
            }

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
        // }
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
        this.isJumping = true;
        // this.isMoving = false;
        var len = this.animSequence.length, 
            last = this.animSequence[len-1],
            i = 6,
            duration = 1000/ len;
        

        var intVal = setInterval( () => {
            if(i < last){
                console.log("We be jumping ... \n direction: " + this.direction);
                this.direction = i;
                
            }else{
                console.log("\n Finished jump animation!!");
                clearInterval(intVal);
                this.isJumping = false;
                // this.isMoving = false;
                this.direction = 3;
            }
            i++;
        }, duration);

        console.log("isJumping: "+this.isJumping);
    }

};
