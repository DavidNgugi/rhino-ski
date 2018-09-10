import utils from './utils';

/**
 * The enemy component
 */
export default {
        direction: 0,
        mapX: 0,
        mapY: 0,
        speed: 3,
        isMoving: false,
        hasCollided: false,
        hasCaughtPlayer: false,
        isFlipped: false,
        assets: [
            'rhinoDefault',
            'rhinoLift',
            'rhinoLiftEat1',
            'rhinoLiftEat2',
            'rhinoLiftEat3',
            'rhinoLiftEat4',
            'rhinoLiftMouthOpen',
            'rhinoLeft',
            'rhinoLeft2'
        ],
        runSequence: [7,8],
        eatSequence: [1, 5, 2, 3, 4, 0],

    /**
     * Resets properties to default
     * @return void
     */
    reset: function(){
        this.direction = 0;
        this.mapX = 0;
        this.mapY = 0;
        this.speed = 3;
        this.isMoving = false;
        this.hasCollided = false;
        this.hasCaughtPlayer = false;
    },

    /**
     * Gets position vector
     * @return object
     */
    getPosition: function(){
        return { x : this.mapX, y : this.mapY };
    },

    /**
     * Gets specific asset based on the direction this is facing
     * @return string
     */
    getAsset: function(){     
        return this.assets[this.direction];
    },

     /**
     * Moves the enemy rhino according to the direction
     * @return void
     */
    move: function(Skier) {
        var dt = 1;
        if(!this.hasCaughtPlayer){
            this.animateRun();
            // this.animateEat();
            // this.direction = (Skier.direction == 3) ? 7 : 8;
            switch(this.direction) {
                case 7:
                    this.mapX = utils.math.lerp(this.mapX, (this.mapX - Math.round(this.speed / 1.4142)), dt);
                    this.mapY = utils.math.lerp(this.mapY, (this.mapY + Math.round(this.speed / 1.4142)), dt);
                    break;
                // case 3:
                //     this.mapY = utils.math.lerp(this.mapY, (this.mapY + this.speed), dt);
                //     break;
                case 8:
                    this.mapX = utils.math.lerp(this.mapX, (this.mapX + this.speed / 1.4142), dt);
                    this.mapY = utils.math.lerp(this.mapY, (this.mapY + this.speed / 1.4142), dt);
                    break;
            }
        }
    },

    animateRun: function(){
        if(this.direction == 8) {
            this.isFlipped = true;
        }
        var len = this.runSequence.length, 
            last = this.runSequence[len-1],
            i = this.runSequence[0],
            duration = 5000/ len;

        var intVal = setInterval( () => {
            if(i <= last){
                console.log("Yum Yum Yum ...");
                this.direction = i;
            }else{
                console.log("\n Finished Running the delicious meal animation!!");
                if(this.hasCaughtPlayer){ clearInterval(intVal);}
            }
            i++;
        }, duration);
    },

    animateEat: function(){
        this.hasCaughtPlayer = false;
        var len = this.eatSequence.length, 
            last = this.eatSequence[len-1],
            lastIndex = last-1,
            i = this.eatSequence[0],
            duration = 1000/ len;
        
        var intVal = setInterval( () => {
            if(i < lastIndex){
                console.log("Yum Yum Yum ...");
                this.direction = this.eatSequence[i];
            }else{
                console.log("\n Finished Eating the delicious meal animation!!");
                // clearInterval(intVal);
                this.direction = last;
            }
            i++;
        }, duration);
    }

}