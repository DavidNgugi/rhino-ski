/**
 * Fakes window.localStorage functionality
 */
export default {
    store: {},
    clear: function () {
        this.store = {};
    },
    setItem: function (key, value) {
        if ((typeof key != 'string')) { throw new TypeError("Key must be of type string"); }
        this.store[key] = value;
    },
    getItem: function (key) {
        if (this.store[key]) { return this.store[key]; }
        return null;
    },
    removeItem: function (key) {
        if (!this.store[key]) { throw new Error("Item with given key does not exist"); }
        delete this.store[key];
    }
}