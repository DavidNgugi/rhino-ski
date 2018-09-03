import utils from './utils';

export default class EventManager {
    constructor() {
        this.registeredEventListeners = [];
        this.firedEvents = [];
    }

    on(event, handler, target) {
        if (!target) {
            target = arguments.callee.caller;
        }

        var name = typeof event == 'string' ? event : utils.getInstanceName(event);

        // check if event already exists
        if (!registeredEventListeners[name]) {
            registeredEventListeners[name] = [];
        }
        //register event
        registeredEventListeners[name].push({handler: handler, target: target});
    }

    fire(event){
        var name = typeof event == 'string' ? event : utils.getInstanceName(event);

        var listeners = this.getListeners(name);

        for(var i = 0; i < listeners.length; i++){
            listeners[i].handler.call(listeners[i].target, event);
            firedEvents[name].push({handler: handler, target: listeners[i].target});
        }
    }

    /**
     * @param Object event
     */
    getListeners(event) {
        var name = typeof event == 'string' ? event: utils.getInstanceName(event);
        if (!registeredEventListeners[name]) {
            registeredEventListeners[name] = [];
        }

        return registeredEventListeners[name];
    }

    reset(){
        registeredEventListeners = [];
        firedEvents = [];
    }
};