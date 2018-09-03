import utils from './utils';

/**
 * The enemy component
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
            'rhinoDefault',
            'rhinoLiftEat1',
            'rhinoLiftEat2',
            'rhinoLiftEat3',
            'rhinoLiftEat4',
            'rhinoLiftMouthOpen',
            'rhinoLift',
            'rhinoLeft',
            'rhinoRight'
        ];

        this.eatSequence = [
            'rhinoLift', 
            'rhinoLiftMouthOpen', 
            'rhinoLiftEat1',
            'rhinoLiftEat2',
            'rhinoLiftEat3',
            'rhinoLiftEat4'
        ]
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
     * Moves the enemy rhino according to the direction
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

    animate(){

    }

}