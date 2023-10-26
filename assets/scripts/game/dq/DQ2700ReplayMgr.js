var ACTION_FAPAI = 1;
var ACTION_SETMAIN = "setMain";
var ACTION_GZP = "getZhungPoker";
var ACTION_GAIPAI = "gaipai";
var ACTION_CHUPAI = 5;
var ACTION_PUSHLUN = "pushLun";

cc.Class({
    extends: cc.Component,

    properties: {
        _lastAction:null,
        _actionRecords:null,
        _jiesuan:null,
        _currentIndex:0,
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
        cc.vv.dqMgr.doBegin();
    },
    
    isReplay:function(){
        return this._actionRecords != null;    
    },

    getNextAction:function(){

        if(this._currentIndex >= this._actionRecords.length){

            //游戏过程结束，显示结算
            if(this._jiesuan != null && this._currentIndex > 0){
                cc.vv.dqMgr.node.emit("jiesuan",{data:this._jiesuan});
            }

            return null;
        }
        
        var data = this._actionRecords[this._currentIndex++];
        return data;
    },

    takeAction:function(){
        var action = this.getNextAction();

        if(action == null){
            return -1;
        }

        this._lastAction = action;

        var nextActionDelay = 1.0;
        if(action.init_score){
            var list = cc.vv.roomMgr.table.list
            for(var i = 0; i < list.length; ++i){
                var seatid = cc.vv.roomMgr.getSeatIndexByID(action.init_score[i].user_id);
                var viewid = cc.vv.roomMgr.viewChairID(seatid);
                cc.vv.dqMgr.node.getComponent('Table').seat_emit(viewid,'score',action.init_score[i].score);
            }
            return 0.1;
        }else if(action.stage == ACTION_FAPAI){
            //发牌
            cc.vv.dqMgr.doFapai(action.pai,action.seatid);
            return 0.5;
        }
        else if(action.stage == ACTION_SETMAIN){
            cc.vv.dqMgr.doSetmain(action.pais,action.seatid);
            return 2;
        }
        else if(action.stage == ACTION_GZP){
            cc.vv.dqMgr.doGetZhuangPoker(action.pai,action.seatId);
            return 2;
        }
        else if(action.stage == ACTION_GAIPAI){
            cc.vv.dqMgr.doGaipai(action.pai,action.seatId);
            return 1;
        }
        else if(action.stage == ACTION_CHUPAI){
            //出牌
            cc.vv.dqMgr.operate(action);
            cc.vv.dqMgr.doChupai(action);
            
            return 1;
        }
        else if(action.stage == ACTION_PUSHLUN){
            cc.vv.dqMgr.doPushlun(action);
            return 2;
        }else if(action.stage == "showMiners"){
            cc.vv.dqMgr.showMiners(action);
            return 2;
        }else if(action.stage == "showFriend"){
            cc.vv.dqMgr.showFriend(action);
            return 2;
        }else if(action.stage == "touXiang"){
            return 2;
        }
    }
});
