cc.Class({
    extends: cc.Component,

    properties: {
        tipLabel:cc.Label,
        _stateStr:'',
        _progress:0.0,
        _splash:null,
        _isLoading:false,
    },

    loading:function(){
        this.node.active = true;
        this.init();
        this.onLoadComplete();
        this.tipLabel.string = this._stateStr;
    },

    init:function(){
        // build\jsb-binary
        // com.xcl.chessroom
        var Net= require("Net");
        cc.vv.net1 = new Net();
        cc.vv.net2 = new Net();

        var G3Plugin = require("G3Plugin")
        cc.vv.g3Plugin = new G3Plugin();
        cc.vv.g3Plugin.init();

        var RoomMgr = require("RoomMgr");
        cc.vv.roomMgr = new RoomMgr();
        
        var GameNetMgr = require("GameNetMgr");
        cc.vv.gameNetMgr = new GameNetMgr();
        cc.vv.gameNetMgr.initHandlers();

        var GameClubMgr = require("GameClubMgr");
        cc.vv.gameClubMgr = new GameClubMgr();
        cc.vv.gameClubMgr.initHandlers();

        var VoiceMgr = require("VoiceMgr");
        cc.vv.voiceMgr = new VoiceMgr();
        cc.vv.voiceMgr.init();
    },
    
    //预加载资源
    startPreloading:function(){
        this._stateStr = "正在加载资源，请稍候";
        this._isLoading = true;
        var self = this;
        // cc.loader.onProgress = function ( completedCount, totalCount,  item ){
        //     if(self._isLoading){
        //         self._progress = completedCount/totalCount;
        //     }
        // };
        
        // cc.loader.loadResDir("textures", function (err, assets) {
            this.node.runAction(cc.sequence(
                cc.delayTime(0.1),
                cc.callFunc(()=>{
                    self._progress = 100
                }),
                cc.delayTime(0.1),
                cc.callFunc(()=>{
                    self.onLoadComplete();
                })
            ))
        // });      
    },
    
    //加载成功
    onLoadComplete:function(){
        this._isLoading = false;
        this._stateStr = "准备登陆";
        this.node.active = false;
        cc.vv.login.login();
        cc.loader.onComplete = null;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this._stateStr.length == 0){
            return;
        }
        this.tipLabel.string = this._stateStr + ' ';
        if(this._isLoading){
            this.tipLabel.string += Math.floor(this._progress * 100) + "%";   
        }
        else{
            var t = Math.floor(Date.now() / 1000) % 4;
            for(var i = 0; i < t; ++ i){
                this.tipLabel.string += '.';
            }            
        }
    }
});