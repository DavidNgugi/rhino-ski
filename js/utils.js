module.exports = {
    toString: function(data){
        return (typeof data === Object) ? JSON.stringify(data) : new Error('Parameter passed is not a JSON object');
    },

    toJson: function(data){
        return (typeof data === String) ? JSON.parse(data) : new Error('Parameter passed is not a string');
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

    getInstanceName: function(eventRef) {
        var tempRefName = "";
        if (typeof eventRef == "object") {
            tempRefName = eventRef._name;
        }
        else {
            var tempRef = new eventRef();
            tempRefName = tempRef._name;
        }
        return tempRefName;
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