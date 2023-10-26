cc.Class({
    extends: cc.Component,

    properties: {
        bgmVolume:1.0,
        sfxVolume:1.0,
        bgmAudioID:-1, 
    },

    // use this for initialization
    init: function () {
        var self = this;
        var t = cc.sys.localStorage.getItem("bgmVolume");
        if(t != null){
            this.bgmVolume = parseFloat(t);    
        }else{
            cc.sys.localStorage.setItem("bgmVolume",this.bgmVolume);
        }
        
        var t = cc.sys.localStorage.getItem("sfxVolume");
        if(t != null){
            this.sfxVolume = parseFloat(t);    
        }else{
            cc.sys.localStorage.setItem("sfxVolume",this.sfxVolume);
        }
        
        self.pauseTime = 0;
        cc.game.on(cc.game.EVENT_HIDE, function () {
            cc.audioEngine.pauseAll();
            self.pauseTime = new Date().getTime();
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            cc.audioEngine.resumeAll();
        });

        //停放所有音频
        cc.audioEngine.stopAll();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    getUrl:function(url){
        return "sounds/" + url;
    },
    
    playBGM(url){
        let self = this;
        var audioUrl = this.getUrl(url);
        cc.vv.log3.debug(audioUrl);
        if(this.bgmAudioID >= 0){
            cc.audioEngine.stop(this.bgmAudioID);
        }
        cc.loader.loadRes(audioUrl, cc.AudioClip, function (err, audioClip) {
            if(err){
                return
            }
            self.bgmAudioID = cc.audioEngine.play(audioClip,false,self.bgmVolume);
        });
    },
   
    playSFX(url){
        let self = this;
        var audioUrl = this.getUrl(url);
        if(this.sfxVolume > 0){
            cc.loader.loadRes(audioUrl, cc.AudioClip, function (err, audioClip) {
                if(err){
                    return -1;
                }
                var audioId = cc.audioEngine.play(audioClip,false,self.sfxVolume);   
                return audioId; 
            });
            
        }else{
            return -1;
        }
    },

    playSFXRepeat(url,cb){
        let self = this;
        let audioId = -1;
        var audioUrl = this.getUrl(url);
        if(this.sfxVolume > 0){
            cc.loader.loadRes(audioUrl, cc.AudioClip, function (err, audioClip) {
                if(err){
                    audioId = -1;
                }
                audioId = cc.audioEngine.play(audioClip,true,self.sfxVolume);
                if(cb){
                    cb(audioId)
                }
            });
        }else{
            audioId = -1;
            if(cb){
                cb(audioId)
            }
        }
       
       
        // return audioId;
    },

    stopSFX(audioId){
        if(this.sfxVolume > 0 && audioId != -1 && audioId != null){
            cc.audioEngine.stop(audioId);
        }
    },

    click(){
        this.playSFX("btn_click");
    },
    
    setSFXVolume:function(v){
        if(this.sfxVolume != v){
            this.sfxVolume = v;
        }
    },
    
    setBGMVolume:function(v,force){
        
        if(this.bgmAudioID >= 0){
            if(this.bgmVolume != v || force){
                this.bgmVolume = v;
                cc.audioEngine.setVolume(this.bgmAudioID,v);
            }
        }
        
    },
    
    pauseAll:function(){
        cc.audioEngine.pauseAll();
    },
    
    resumeAll:function(){
        cc.audioEngine.resumeAll();
    }
});
