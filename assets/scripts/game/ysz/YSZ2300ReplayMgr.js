var ACTION_FAPAI = "faPai";
var ACTION_DINGZHUANG = "dingZhuang";
var ACTION_XIAZHU   = "xiaZhu";
var ACTION_KAIPAI   = "hand";
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
                cc.vv.yszMgr.node.emit("jiesuan",{data:this._jiesuan});
            }

            return null;
        }
        
        var data = this._actionRecords[this._currentIndex++];
        return data;
    },
    
    takeAction:function(){
        var action = this.getNextAction();

        this._lastAction = action;
        if(action == null){
            return -1;
        }
        var nextActionDelay = 1.0;
        if(action.init_score){
            var list = action.init_score;
            for(var i = 0; i < list.length; ++i){
                cc.vv.roomMgr.table.list[i].score = list[i].score;
                var seatid = cc.vv.roomMgr.getSeatIndexByID(action.init_score[i].user_id);
                var viewid = cc.vv.roomMgr.viewChairID(seatid);
                cc.vv.yszMgr.node.getComponent('Table').seat_emit(viewid,'score',action.init_score[i].score);
            }
            return 0.5;
        }else if(action.hand != null && this._currentIndex == 2){
            cc.vv.yszMgr.replay_deal_fapai(action,this._currentIndex);
            return 2;
        }else if(action.opera == "fapai"){
            cc.vv.yszMgr.beginFen(action);
            return 1.3;
        }else if(action.opera == "genzhu"){
            cc.vv.yszMgr.genZhu(action);
            return 1.3;
        }else if(action.opera == "jiazhu"){
            cc.vv.yszMgr.jiaZhu(action);
            return 1.3;
        }else if(action.opera == "bipai"){
            cc.vv.yszMgr.bipai(action);
            var time = 3;
            if(cc.vv.utils.numFormat(cc.vv.replayMgr.speed) == 0.9){
                time = 3.3; 
            }else if(cc.vv.utils.numFormat(cc.vv.replayMgr.speed) == 0.8){
                time = 3.8; 
            }else if(cc.vv.utils.numFormat(cc.vv.replayMgr.speed) == 0.7){
                time = 4.2; 
            }else{
                time = 3; 
            }
            return time;
        }else if(action.opera == "pushLun"){
            cc.vv.yszMgr.pushLun(action);
            return 0.5;
        }else if(action.opera == "kanpai"){
            cc.vv.yszMgr.kanpai_1(action);
            return 1.3;
        }else if(action.opera == "qipai"){
            cc.vv.yszMgr.qipai(action);
            return 1.3;
        }else if(action.opera == "cheat"){
            cc.vv.yszMgr.qipai(action);
            return 1.3;
        }else if(action.opera == "gameEndKaiPai"){
            cc.vv.yszMgr.gameEndKaiPai(action);
            return 2.4;
        }else if(action.opera == "changePwb"){
            cc.vv.yszMgr.room_pwb_change(action);
            return 0.5;
        }else{
            return 0.5;
        }
    }
});
