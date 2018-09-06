import $ from 'jquery';
/**
 * Stores the path to all game assets and loads assets
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
        audio: {
            'WildWaters'             : 'sound/WildWaters.mp3'
        }
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
        if(!name) { throw new Error("No value for name has been given") }
        return this.assets.images[name];
    },

    /**
     * Gets a specific audio asset from the assets
     * @return string
     */
    getAudioAsset: function(name){
        if(!name) { throw new Error("No value for name has been given") }
        return this.assets.audio[name];
    },

     /**
     * Asynchronously Load each asset from Asset Store 
    //  * @return {Promise}
     */
    loadAssets: function() {
        var assetPromises = [];

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
            assetPromises.push(assetDeferred.promise());
        });

        // load the audio too
        if(Object.keys(this.assets.audio).length > 0){
            
             _.each(this.assets.audio, function(asset, assetName) {

                var assetDeferred = new $.Deferred();
                context.loadedAssets.audio[assetName] = asset;
                assetDeferred.resolve();
                
                assetPromises.push(assetDeferred.promise());
            });
        }
        return $.when.apply($, assetPromises);
    },

    asyncLoadAssets: function() {

        var context = this;

        // load images
         _.each(this.assets.images, function(asset, assetName) {

            var assetImage = new Image();
            assetImage.width /= 2;
            assetImage.height /= 2;
            assetImage.src = asset;
            context.loadedAssets.images[assetName] = assetImage;
        });

        if(Object.keys(this.assets.audio).length > 0){
            // load the audio too
             _.each(this.assets.audio, function(asset, assetName) {
                context.loadedAssets.audio[assetName] = asset;
            });
        }

        return new Promise( (resolve, reject) => {
            if(Object.keys(this.loadedAssets.images).length > 0 && Object.keys(this.loadedAssets.audio).length > 0){
                resolve('Assets loaded');
            }else{
                reject(Error('Assets not loaded'));
            }
        });
    }



}