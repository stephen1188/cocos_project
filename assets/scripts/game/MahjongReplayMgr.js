var ACTION_CHUPAI = 1;
var ACTION_MOPAI  = 2;
var ACTION_PENG   = 3;
var ACTION_GANG   = 4;
var ACTION_HU     = 5;
var ACTION_ZIMO   = 6;
var ACTION_CHI    = 7;
var ACTION_BUHUA  = 8;

var ACTION_ANGANE   = 9;
var ACTION_DIANGANE = 10;
var ACTION_WANGGANE = 11;

var ACTION_ANGAME_SFYG     = 12;
var ACTION_DIANGANE_SFYG   = 13;
var ACTION_WANGGANE_SFYG   = 14;

var ACTION_TING            = 15;
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
                cc.vv.mahjongMgr.node.emit("jiesuan",{data:this._jiesuan});
            }else{
                cc.vv.mahjongMgr.node.emit("jiesuan",{data:this._jiesuan});
            }

            return null;
        }
        
        var data = this._actionRecords[this._currentIndex++];
        return {si:data.si,type:data.type,pai:data.pai,actPai:data.act};
    },
    
    takeAction:function(){
        var action = this.getNextAction();
        if(this._lastAction != null && (this._lastAction.type == ACTION_CHUPAI || this._lastAction.type ==ACTION_BUHUA )){
            if(action != null && action.type != ACTION_PENG && action.type != ACTION_GANG && action.type != ACTION_HU && action.type != ACTION_CHI){
                cc.vv.mahjongMgr.doGuo(this._lastAction.si,this._lastAction.pai);
            }
        }
        this._lastAction = action;
        if(action == null){
            return -1;
        }
        var nextActionDelay = 1.0;
        if(action.type == ACTION_SCORE){
            var list = cc.vv.roomMgr.table.list
            for(var i = 0; i < list.length; ++i){
                var viewid = cc.vv.roomMgr.viewChairID(list[i].seatid);
                cc.vv.nnMgr.node.getComponent('Table').seat_emit(viewid,'score',action.data[i].score);
            }
            return 0.0;
        }else if(action.type == ACTION_CHUPAI){
            //cc.log3.debug("chupai");
            if(action.actPai.length == 3){
                cc.vv.mahjongMgr.doChupai(action.si,action.pai,action.actPai[1],action.actPai[2]);
            }else{
                cc.vv.mahjongMgr.doChupai(action.si,action.pai);
            }
            
            return 0.5;
        }
        else if(action.type == ACTION_MOPAI){
            //cc.log3.debug("mopai");
            cc.vv.mahjongMgr.doMopai(action.si,action.pai);

            //补充余牌
            if(action.actPai.length == 3){
                cc.vv.mahjongMgr.doMjCount(action.actPai[1],action.actPai[2]);
            }
            
            cc.vv.mahjongMgr.doTurnChange(action.si);
            return 0.5;
        }
        else if(action.type == ACTION_PENG){
            //cc.log3.debug("peng");
            cc.vv.mahjongMgr.doPeng(action.si,action.actPai);
            cc.vv.mahjongMgr.doTurnChange(action.si);
            return 1.0;
        }
        else if(action.type == ACTION_ANGANE||action.type ==ACTION_DIANGANE || action.type == ACTION_WANGGANE
        || action.type == ACTION_ANGAME_SFYG||action.type ==ACTION_DIANGANE_SFYG || action.type == ACTION_WANGGANE_SFYG){
            //cc.log3.debug("gang");

            cc.vv.mahjongMgr.dispatchEvent('hangang_notify',action.si);
            cc.vv.mahjongMgr.doGang(action.si,action.pai,action.actPai,action.type);
            cc.vv.mahjongMgr.doTurnChange(action.si);
            return 1.0;
        }
        else if(action.type == ACTION_HU){
            //cc.log3.debug("hu");
            cc.vv.mahjongMgr.doHu({seatIndex:action.si,hupai:action.pai,iszimo:false});
            return 1.5;
        }
        else if(action.type == ACTION_ZIMO)
        {
            cc.vv.mahjongMgr.doHu({seatIndex:action.si,hupai:action.pai,iszimo:true});
            return 1.5;
        }
        else if(action.type ==  ACTION_CHI)
        {
            cc.vv.mahjongMgr.doChi(action.si,action.pai,action.actPai);
            return 1.0;
        }
        else if(action.type == ACTION_BUHUA)
        {
            cc.vv.mahjongMgr.doBuhua(action.si,action.pai,0);
            return 1.0;
        }
        else if(action.type == ACTION_TING)
        {
            cc.vv.mahjongMgr.doTing({userid:action.pai});
            return 1.0;
        }else{
            return 1.0; 
        }
    }
});
