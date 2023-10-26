var ACTION_FAPAI = "faPai";
var ACTION_DINGZHUANG = "dingZhuang";
var ACTION_XIAZHU   = "xiaZhu";
var ACTION_KAIPAI   = "hand";

cc.Class({
    extends: cc.Component,

    properties: {
        _lastAction:null,
        _actionRecords:null,
        _jiesuan:null,
        _currentIndex:0,
    },

    // use this for initialization
    onLoad: function () {

    },
    
    clear:function(){
        this._lastAction = null;
        this._actionRecords = null;
        this._currentIndex = 0;
    },
    
    init:function(record,jiesuan){
        this._actionRecords = record;
        this._jiesuan = jiesuan;
        if(this._actionRecords == null){
            this._actionRecords = {};
        }
        this._currentIndex = 0;
        this._lastAction = null;
    },
    
    isReplay:function(){
        return this._actionRecords != null;    
    },
    
    getNextAction:function(){

        if(this._currentIndex >= this._actionRecords.length){

            //游戏过程结束，显示结算
            if(this._jiesuan != null && this._currentIndex > 0){
                cc.vv.jgdsgMgr.node.emit("jiesuan",{data:this._jiesuan});
            }

            return null;
        }
        
        var data = this._actionRecords[this._currentIndex++];
        return {data:data.data,action:data.action};
    },
    
    takeAction:function(){
        var action = this.getNextAction();

        this._lastAction = action;
        if(action == null){
            return -1;
        }
        var nextActionDelay = 1.0;
        if(action.action == ACTION_DINGZHUANG){
            cc.vv.jgdsgMgr.doDingZhuang(action.data);

            return 1;
        }else if(action.action == ACTION_FAPAI){
            cc.vv.jgdsgMgr.doFapai(action.data);

            return 3;
        }
        else if(action.action == ACTION_XIAZHU){
            cc.vv.jgdsgMgr.doXiaZhu(action.data);

            return 2;
        }else if(action.action == ACTION_KAIPAI){
            cc.vv.jgdsgMgr.doKaipai(action.data);

            return 2;
        }
    }
});
