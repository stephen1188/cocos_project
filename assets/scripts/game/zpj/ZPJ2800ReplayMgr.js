var ACTION_QIANG="dingZhuang"
var ACTION_DINGZHUANG  = "touZi";
var ACTION_GETEND = "getEnd"    //停止摇动色子 发牌
var ACTION_XIAZHU = "xiaZhu";
// var ACTION_XIAZHU   = "xiazhu";
// var ACTION_FAPAI_2   = "kaipai";
var ACTION_KAIPAI     = "hand";
var ACTION_SCORE   = "score";

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
                cc.vv.ZPJMgr.node.emit("jiesuan",{data:this._jiesuan});
            }

            return null;
        }
        
        var data = this._actionRecords[this._currentIndex++];
        return {data:data.data,action:data.action,type:data.type};
    },
    
    takeAction:function(){
        var action = this.getNextAction();

        this._lastAction = action;
        if(action == null){
            return -1;
        }
        var nextActionDelay = 1.0;
        if(action.action == ACTION_SCORE){
            var list = cc.vv.roomMgr.table.list
            for(var i = 0; i < list.length; ++i){
                var viewid = cc.vv.roomMgr.viewChairID(list[i].seatid);
                cc.vv.ZPJMgr.node.getComponent('Table').seat_emit(viewid,'score',action.data[i].score);
            }
            return 0.5;
        }else if(action.action==ACTION_QIANG){
            cc.vv.ZPJMgr.doQiang(action.data);
            return 2;
        }else if(action.action ==  ACTION_DINGZHUANG){
            cc.vv.ZPJMgr.doDingZhuang(action.data);
            return 1;
        }else if(action.action == ACTION_GETEND){
            cc.vv.ZPJMgr.doGetEnd(action.data);
            return 3;
        }else if(action.action == ACTION_XIAZHU){
            cc.vv.ZPJMgr.doXiaZhu(action.data);
            return 1;
        }else if(action.action == ACTION_KAIPAI){
            cc.vv.ZPJMgr.doKaipai(action);

            return 1;
        }
    }
});
