import utils from './utils';

/**
 * Manages storage of game data
 */
export default {
    // highscore stuff
    highscore: {
        set: function(value){
            if(!value){
                throw new Error("Value cannot be empty");
            }
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
            if(!data){
                throw new Error("Data cannot be empty");
            }
            utils.setItem('ceros_game_data', JSON.stringify(data));
        },
        get: function(){
            return utils.toJson(utils.getItem('ceros_game_data'));
        }
    }
};