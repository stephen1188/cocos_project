
cc.Class({
    extends: cc.Component,
    properties: {
        _nextPlayTime:1,
        _replay:null,
        _isPlaying:true,
        _speed:1.0,
        nodePlay:cc.Node,
        nodePause:cc.Node,
    },
    onLoad:function(){
        cc.vv.replayMgr.speed = 1.0;
    },

    onBtnPauseClicked:function(){
        this._isPlaying = false;
        this.nodePlay.active = true;
        this.nodePause.active = false;
    },

    onBtnFastClicked:function(){
        if(this._speed > 0.7){
            cc.vv.replayMgr.speed = this._speed;
            this._speed = this._speed - 0.1;
        }
    },

    onBtnRewindClicked:function(){
        if(this._speed < 2.0){
            this._speed = this._speed + 0.1;
        }
    },
    
    onBtnPlayClicked:function(){
        this._isPlaying = true;
        this.nodePlay.active = false;
        this.nodePause.active = true;
    },
    
    onBtnBackClicked:function(){
        cc.vv.userMgr.is_replay = false;
        cc.vv.replayMgr.clear();
        cc.director.loadScene("hall");
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(cc.vv){
            if(this._isPlaying && cc.vv.replayMgr != null && cc.vv.replayMgr.isReplay() == true && this._nextPlayTime > 0){
                this._nextPlayTime -= dt;
                if(this._nextPlayTime < 0){
                    this._nextPlayTime = this._speed * cc.vv.replayMgr.takeAction();
                }
            }
        }
    },
});
