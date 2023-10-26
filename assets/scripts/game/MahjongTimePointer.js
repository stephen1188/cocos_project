cc.Class({
    extends: cc.Component,

    properties: {
        _arrow:null,
        _arrow_pointer:null,
        _pointer:null,
        _timeLabel:null,
        _time:-1,
        _stop:false,
        _alertTime:-1,
        _audioId:-1,
        _play_direction:null,
    },

    // use this for initialization
    onLoad: function () {

        var gameChild = cc.find("Canvas/mgr/game");
        this._arrow = gameChild.getChildByName("arrow");
        this._arrow_pointer = this._arrow.getChildByName("arrow_pointer");
        this._pointer = this._arrow_pointer.getChildByName("pointer");
        this._play_direction = gameChild.getChildByName("play_direction");
        this._play_direction_bg = gameChild.getChildByName("play_direction_bg");
        this._direction_time = this._play_direction_bg.getChildByName("time");
        this._timeLabel = this._arrow.getChildByName("lblTime").getComponent(cc.Label);
        this._timeLabel.string = "00";
        
        var self = this;
        
        this.node.on('game_begin',function(data){   
            self._stop = false;                   
            self.initPointer();
        });

        this.node.on('login_finished',function(data){
            self.initPointer();
        });

        this.node.on('game_sync',function(data){
            self.initPointer();
        });
        
        this.node.on('game_chupai',function(data){
            self._stop = false;
            self.initPointer();
            self._time = 20;
            self._alertTime = 3;
            self.stopDiDi();
        });

        this.node.on("game_over",function(data){
            self._stop = true;
            self.stopDiDi();
        });

        this.node.on("peng_notify",function(data){
            self.stopDiDi();
        });

        this.node.on("chi_notify",function(data){
            self.stopDiDi();
        });

        this.node.on("buhua_notify",function(data){
            self.stopDiDi();
        });

        this.node.on("gang_notify",function(data){
            self.stopDiDi();
        });

        this.node.on("game_end",function(data){
            self._stop = true;
            self.stopDiDi();
        });
    }, 
    
    pointer_time:function(){
        this.point_time--;
 
        if(this.point_time <= 0){
            this.point_time = 0;
            cc.vv.audioMgr.playSFX('timeup_alarm');
            this.unschedule(this.pointer_time);
        }
        this._direction_time.getComponent(cc.Label).string = this.point_time;
    },

    initPointer:function(){
        var self = this;
        if(cc.vv == null){
            return;
        }
        
        if(cc.vv.roomMgr.started == 1){
            this.point_time = 10;
            this.schedule(this.pointer_time,1);
            cc.vv.folds.hideChupai();
            this._direction_time.getComponent(cc.Label).string = this.point_time;
        }
        //this._arrow.active = cc.vv.mahjongMgr._gamestate == 3;
        // if(!this._arrow.active){
        //     return;
        // }
        // var zhuanIndex = cc.vv.roomMgr.viewChairID(cc.vv.mahjongMgr._button);
        // if (zhuanIndex == 1 && cc.vv.roomMgr.ren == 2)
        //     this._arrow_pointer.rotation = 0; 
        // else
        //     this._arrow_pointer.rotation = 180-zhuanIndex * 90;  

        var turn = cc.vv.mahjongMgr._turn;
        var localIndex = cc.vv.roomMgr.viewChairID(turn);

        self._stop = (localIndex != 0);

       var rtn=0;
        if (localIndex==1)
            rtn=90;
        else if (localIndex==0)
            rtn=180;
        else if (localIndex==3)
            rtn=270;
        else if (localIndex==2)
            rtn=0;
        if (localIndex==0 && cc.vv.roomMgr.ren==3)
            rtn=180;
        else if (localIndex==1 && cc.vv.roomMgr.ren==3)
            rtn=90;
        else if (localIndex==2 && cc.vv.roomMgr.ren==3)
            rtn=271;
        if (localIndex==1 && cc.vv.roomMgr.ren==2){
            rtn=0;
            this._play_direction.rotate=358;
        }else if (localIndex==0 && cc.vv.roomMgr.ren==2){
            rtn=180;
            this._play_direction.rotate=182;
        }
           
        this._play_direction.runAction(cc.rotateTo(0.3, rtn));

        // var turnNum =  (this._arrow_pointer.rotation / 90);
        // if (turn == 1 && cc.vv.roomMgr.ren == 2)
        //     localIndex = 0;
        // else if (turn == 0 && cc.vv.roomMgr.ren == 2)
        //     localIndex = 2;
        // else if (turn == 1 && cc.vv.roomMgr.ren == 3 && localIndex == 1)
        //     localIndex = 3;
        // else if (turn == 0 && cc.vv.roomMgr.ren == 3 && localIndex == 2)
        //     localIndex = 3;
        // else
        //     localIndex = (turnNum + localIndex + cc.vv.roomMgr.ren) % cc.vv.roomMgr.ren;



        // for(var i = 0; i < this._pointer.children.length; ++i){
        //     this._pointer.children[i].active = i == localIndex;
        // }
    },

    //停止滴滴提示音
    stopDiDi:function(){
        if(this._audioId == -1)return;
        cc.vv.audioMgr.stopSFX(this._audioId);
        this._audioId = -1;
    },
    
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this._time > 0){
            this._time -= dt;
            if(!this._stop && !(cc.vv.replayMgr.isReplay()) && this._alertTime > 0 && this._time < this._alertTime){
                this._audioId = cc.vv.audioMgr.playSFX("timeup_alarm");
                this._alertTime = -1;
            }
            var pre = "";
            if(this._time < 0){
                this._time = 0;
            }
            
            var t = Math.ceil(this._time);
            if(t < 10){
                pre = "0";
            }
            this._timeLabel.string = pre + t; 
        }
    },
});
