export default {
    toString: function(data){
        return (typeof data === Object) ? JSON.stringify(data) : new Error('Parameter passed is not a JSON object');
    },

    toJson: function(data){
        return (typeof data === "string") ? JSON.parse(data) : null;
    },

    setItem: function(key, value){
        if (window && window.localStorage || window.sessionStorage) {
            window.sessionStorage.setItem(key, value) || window.localStorage.setItem(key, value);
        }
    },
    
    getItem: function(key) {
        var data = null;
        if (window && window.localStorage || window.sessionStorage) {
            data = window.sessionStorage.getItem(key) || window.localStorage.getItem(key);
        }
        return data;
    },

    removeItem: function(key){
        if (window && window.localStorage || window.sessionStorage) {
            window.sessionStorage.removeItem(key) || window.localStorage.removeItem(key);
        }
    },

    clearAll: function(){
        if (window && window.localStorage || window.sessionStorage) {
            window.sessionStorage.clear() || window.localStorage.clear();
        }
    },

    getCollisionRect: function(game, gameObj){
        var AssetName = gameObj.getAsset();
        var gameObjImage = game.loadedAssets.images[AssetName];
        var collisionRect = {
            left: gameObj.mapX + game.width / 2,
            right: gameObj.mapX + gameObjImage.width + game.width / 2,
            top: gameObj.mapY + gameObjImage.height - 5 + game.height / 2,
            bottom: gameObj.mapY + gameObjImage.height + game.height / 2
        };

        return collisionRect;
    },
    
    math: {
         /**
         * Linear Interpolation
         * @param {int} current 
         * @param {int} goal 
         * @param {int} dt 
         */
        lerp : function(current, goal, dt){
            return current + (goal-current) * dt;
        }
    }
};