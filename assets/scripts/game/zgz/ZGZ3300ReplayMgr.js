// (1:等待发牌2:等待叫牌3:叫牌4:发牌5:出牌阶段6:结束7:自动)
var ACTION_WAITJIAOPAI = 2;
var ACTION_JIAOPAI = 3;
var ACTION_FAPAI = 4;
var ACTION_SETMAIN = "setMain";
var ACTION_GZP = "getZhungPoker";
var ACTION_GAIPAI = "gaipai";
var ACTION_CHUPAI = 5;
var ACTION_END = 6;
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
        cc.vv.zgzMgr.doBegin();
    },
    
    isReplay:function(){
        return this._actionRecords != null;    
    },

    getNextAction:function(){

        if(this._currentIndex >= this._actionRecords.length){

            //游戏过程结束，显示结算
            if(this._jiesuan != null && this._currentIndex > 0){
                cc.vv.zgzMgr.node.emit("jiesuan",{data:this._jiesuan});
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

        if(action.init_score){
            // var list = cc.vv.roomMgr.table.list
            // for(var i = 0; i < list.length; ++i){
            //     var seatid = cc.vv.roomMgr.getSeatIndexByID(action.init_score[i].user_id);
                // var viewid = cc.vv.roomMgr.viewChairID(seatid);
                // cc.vv.zgzMgr.node.getComponent('Table').seat_emit(viewid,'score',action.init_score[i].score);
            // }
            cc.vv.zgzMgr.doZhuFen(action.init_score);
            return 0.1;
        }else if(action.stage == ACTION_FAPAI){
            //发牌
            cc.vv.zgzMgr.doFapai(action.pai,action.seatid);
            return 0.5;
        }else if(action.stage == ACTION_JIAOPAI){
            //叫牌
            cc.vv.zgzMgr.doSanAction(action);
            // cc.vv.zgzMgr.doFapai(action.pai,action.seatid);
            return 1;
        }
        else if(action.stage == ACTION_CHUPAI){
            //出牌
            cc.vv.zgzMgr.operate(action);
            cc.vv.zgzMgr.doChupai(action);
            
            return 2;
        }
        else if(action.stage == ACTION_END){
            return 0.5;
        }
    }
});
