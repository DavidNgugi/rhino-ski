import AssetManager from '../js/AssetManager';
var assert = require('assert');
var expect = require('chai').expect;

describe('Asset Manager', () => {
    
    describe('Assets', () => {
        
        it("should have 24 image files", done => {
            assert.equal(Object.keys(AssetManager.assets.images).length, 24);
            done();
        });

        it("should have 1 audio files", done => {
            assert.equal(Object.keys(AssetManager.assets.audio).length, 1);
            done();
        });

        it("should have no loaded assets", done => {
            assert.equal(Object.keys(AssetManager.loadedAssets.images).length, 0);
            assert.equal(Object.keys(AssetManager.loadedAssets.audio).length, 0);
            done();
        });

        describe('When retrieving assets', () => {
            it("should be able to retrieve image by name", done => {
                assert.equal(AssetManager.getImageAsset('skierDown'), 'img/skier_down.png');
                done();
            });
    
            it("should be able to retrieve audio by name", done => {
                assert.equal(AssetManager.getAudioAsset('WildWaters'), 'sound/WildWaters.mp3');
                done();
            });
    
            it("should throw error if no name given when getting Image", done => {
                expect(AssetManager.getImageAsset).to.throw("No value for name has been given");
                done();
            });
            it("should throw error if no name given when getting Audio", done => {
                expect(AssetManager.getAudioAsset).to.throw("No value for name has been given");
                done();
            });
        })
        
    });

    describe('When loading assets', () => {

        before(async () => {
            await AssetManager.asyncLoadAssets();
        })
       
        it("should load all assets", done => {
            assert.equal(Object.keys(AssetManager.loadedAssets.images).length, 24);
            assert.equal(Object.keys(AssetManager.loadedAssets.audio).length, 1);
            done();
        })
    })
    

})
