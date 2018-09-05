import $ from 'jquery';
/**
 * Stores the path to all game assets
 */
export default {
    assets: {
        images : {
            'skierCrash'            : 'img/skier_crash.png',
            'skierLeft'             : 'img/skier_left.png',
            'skierLeftDown'         : 'img/skier_left_down.png',
            'skierDown'             : 'img/skier_down.png',
            'skierRightDown'        : 'img/skier_right_down.png',
            'skierRight'            : 'img/skier_right.png',
            'skierJump1'            : 'img/skier_jump_1.png',
            'skierJump2'            : 'img/skier_jump_2.png',
            'skierJump3'            : 'img/skier_jump_3.png',
            'skierJump4'            : 'img/skier_jump_4.png',
            'skierJump5'            : 'img/skier_jump_5.png',
            'rhinoDefault'          : 'img/rhino_default.png',
            'rhinoLiftEat1'         : 'img/rhino_lift_eat_1.png',
            'rhinoLiftEat2'         : 'img/rhino_lift_eat_2.png',
            'rhinoLiftEat3'         : 'img/rhino_lift_eat_3.png',
            'rhinoLiftEat4'         : 'img/rhino_lift_eat_4.png',
            'rhinoLiftMouthOpen'    : 'img/rhino_lift_mouth_open.png',
            'rhinoLift'             : 'img/rhino_lift.png',
            'rhinoLeft'             : 'img/rhino_run_left.png',
            'rhinoLeft2'            : 'img/rhino_run_left_2.png',
            'tree'                  : 'img/tree_1.png',
            'treeCluster'           : 'img/tree_cluster.png',
            'rock1'                 : 'img/rock_1.png',
            'rock2'                 : 'img/rock_2.png'
        },
        audio: {}
    },

    obstacles:  {
        types: [
            'tree',
            'treeCluster',
            'rock1',
            'rock2',
            'ramp'
        ]
    },

    loadedAssets: { images: {}, audio: {} },

    /**
     * Gets a specific image asset from the assets
     * @return string
     */
    getImageAsset: function(name){
        return this.assets.images[name];
    },

    /**
     * Gets a specific audio asset from the assets
     * @return string
     */
    getAudioAsset: function(name){
        return this.assets.audio[name];
    },

     /**
     * Asynchronously Load each asset from Asset Store 
    //  * @return {Promise}
     */
    loadAssets: function() {
        var assetPromises = [];

        var count = this.assets.images.length + this.assets.audio.length;

        var loaded = 0;

        var context = this;

        // load images
         _.each(this.assets.images, function(asset, assetName) {

            var assetImage = new Image();
            var assetDeferred = new $.Deferred();

            var that = context;
            assetImage.onload = function() {
                assetImage.width /= 2;
                assetImage.height /= 2;
                that.loadedAssets.images[assetName] = assetImage;
                assetDeferred.resolve();
            };
            assetImage.src = asset;
            loaded++;
            assetPromises.push(assetDeferred.promise());
        });

        if(this.assets.audio.length > 0){
            // load the audio too
             _.each(this.assets.audio, function(asset, assetName) {

                var assetAudio = new Audio();
                var assetDeferred = new $.Deferred();

                var that = context;
                assetAudio.onload = function() {
                    that.loadedAssets.audio[assetName] = assetAudio;
                    assetDeferred.resolve();
                };
                assetAudio.src = asset;
                loaded++;
                assetPromises.push(assetDeferred.promise());
            });
        }
        return $.when.apply($, assetPromises);
    }
}