cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad:function(){
        //监听协议
        this.initEventHandlers();
    },

    prepareReplay:function(){
        this.dispatchEvent("param",{data:cc.vv.roomMgr.param});
        cc.vv.roomMgr.real = cc.vv.roomMgr.enter.real;
    },
    
    dispatchEvent(event,data){
        if(this.node){
            this.node.emit(event,data);
        }    
    },

    initEventHandlers:function(){

    },

    doBegin:function(){
        this.dispatchEvent('begin',{errcode:0});
    },

    doFapai:function(pai,seatid){
        if(seatid == cc.vv.roomMgr.seatid){
            this.dispatchEvent('fapai',{data:{pai:pai}});
        }
        else{
            this.dispatchEvent('showMing',{pai:pai,seatid:seatid});
        }
       
    },

    doChupai:function(action){
        var data = {
            seatid:action.chuPaiPeopleSeatid,
            beishu:action.power,
            list:action.chupai,
            pais:action.pais,
            nowZha:action.nowZha,
            type:action.type,
            shouchu:action.shouchu
        };
        this.dispatchEvent('chupai',{data:data,errcode:0});
    },

    operate:function(action){
        this.dispatchEvent('showClock',{seatid:action.chuPaiPeopleSeatid});
    }
    // update (dt) {},
});
