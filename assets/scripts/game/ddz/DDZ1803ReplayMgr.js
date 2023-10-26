var ACTION_FAPAI = 1;
var ACTION_QIANGZHUANG = 2;
var ACTION_CHUPAI = 5;
var ACTION_END = 6;
var ACTION_SCORE   = "score";

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
        cc.vv.ddzMgr.doBegin();
    },
    
    isReplay:function(){
        return this._actionRecords != null;    
    },

    getNextAction:function(){

        if(this._currentIndex >= this._actionRecords.length){

            //游戏过程结束，显示结算
            if(this._jiesuan != null && this._currentIndex > 0){
                cc.vv.ddzMgr.node.emit("jiesuan",{data:this._jiesuan});
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
                cc.vv.ddzMgr.node.getComponent('Table').seat_emit(viewid,'score',action.init_score[i].score);
            }
            return 0.1;
        }else if(action.stage == 1){
            //发牌
            cc.vv.ddzMgr.doFapai(action.pai,action.seatid);
            return 0.5;
        }
        else if(action.stage == 2){
            //定庄
            var power = action.qiangzhuang[action.dizhuseatid];
            cc.vv.ddzMgr.doDingZhuang(action.dizhuseatid,power,action.dipai);
            return 1;
        }
        else if(action.stage == 3){
            //拉
            cc.vv.ddzMgr.doLa(action);
            return 0.5;
        }
        else if(action.stage == 4){
            //踢
            cc.vv.ddzMgr.doTi(action);
            return 0.5;
        }
        else if(action.stage == 5){
            //出牌
            cc.vv.ddzMgr.doChupai(action);
            cc.vv.ddzMgr.operate(action);
            return 2;
        }
        else if(action.stage == 6){
            //结算
            return 0.5;
        }
        else if(action.stage == 9){
            //明牌
            cc.vv.ddzMgr.doMing(action);
            return 0.5;
        }
    }
});
