import utils from './utils';

/**
 * The player component
 */
export default class Skier {

    constructor(){
        this.direction = 5;
        this.mapX = 0;
        this.mapY = 0;
        this.speed = 8;
        this.isMoving = false;
        this.hasCollided = false;
        this.assets = [
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
        ];

        this.jumpSequence = [
            'skierJump1',
            'skierJump2',
            'skierJump3',
            'skierJump4',
            'skierJump5'
        ];

        this.jumpTime = 1000;
    }

    /**
     * Resets properties to default
     * @return void
     */
    reset(){
        this.direction = 5;
        this.mapX = 0;
        this.mapY = 0;
        this.speed = 8;
        this.isMoving = false;
        this.hasCollided = false;
    }

    /**
     * Gets position vector
     * @return {object}
     */
    get position(){
        return { x : this.mapX, y : this.mapY };
    }

    /**
     * Gets specific asset based on the direction this is facing
     * @return {string}
     */
    get asset(){        
        return this.assets[this.direction];
    }

     /**
     * Moves the skier according to the direction
     * @return void
     */
    move() {
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
    }

    onMoveLeft(event){
        if(this.direction === 0)
            this.direction = 1;
        else
            this.direction = 2;
        
            this.mapX += this.speed;
    }

    onMoveRight(event){
        if(this.direction === 0)
            this.direction = 5;
        else
            this.direction = 4;

        this.mapX += this.speed;
    }

    onMoveUp(event){
        // this.mapY-= this.speed;
        this.speed -= 0.5;
        this.isMoving = false;
        this.mapY += this.speed;
    }

    onMoveDown(event){
        this.direction = 3;
        this.mapY += this.speed;
    }

    onJump(event){
        this.animateJump();
    }

    animateJump(){
        setTimeout(() => {
            //jump 
        }, this.jumpTime);
    }

}