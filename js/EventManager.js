/**
 * Manages all evnets in the game
 */
export default {
    registeredEventListeners: [],
    firedEvents: [],

    /**
     * Registers an event 
     * @param {String} event 
     * @param {Function} handler 
     * @param {Object} target 
     * @returns void
     */
    on: function(event, handler, target) {
        /**
         * Apparently I can't get the callee.caller because of webpack's strict mode
        */

        // if (!target) {
        //     target = arguments.callee.caller;
        // }
        // check if event already exists
        if (!this.registeredEventListeners[event]) {
            this.registeredEventListeners[event] = [];
            //register event
            this.registeredEventListeners[event].push({handler: handler, target: target});
        }
        
    },

    /**
     * Calls/Fires a registered event
     * @param {String} event 
     */
    fire: function(event){
        try{
            // get all listeners for that event
            var listeners = this.getListeners(event);
            // console.log('Event: '+event);
            // lop through and call them **
            for(var i = 0; i < listeners.length; i++){
                var listener = listeners[i].target;
                // console.log("calling " + listeners[i].handler);
                listeners[i].handler.call(listener);
                // this.firedEvents[event].push({handler: listeners[i].handler, target: listeners[i].target});
            }
        }catch(e){
            // console.log("Event not fired. "+ e);
            throw new Error("Event not fired");
        }
    },

    /**
     * 
     * @param {String} event
     * @returns Array
     */
    getListeners: function(event) {
        if (!this.registeredEventListeners[event]) {
            this.registeredEventListeners[event] = [];
        }
        return this.registeredEventListeners[event];
    },

    /**
     * Reset all trackers for listeners and fired events
     */
    reset: function(){
        this.registeredEventListeners = [];
        this.firedEvents = [];
    }
};