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
    },
    doZhuFen(data){
        this.dispatchEvent('setZhuaFen',data);
        
    },
    // doSetmain:function(pais,seatid){
    //     this.dispatchEvent('getMain',{data:{pais:pais,seatId:seatid}});
    // },

    // doGetZhuangPoker:function(pai,seatid){
    //     this.dispatchEvent('getZhungPoker',{data:{pai:pai,seatId:seatid}});
    // },

    // doGaipai:function(pai,seatid){
    //     this.dispatchEvent('gaipai',{data:{hand:pai,seatId:seatid}});
    // },

    doChupai:function(action){
        var data = {
            seatid:action.chuPaiPeopleSeatid,
            type:action.type,
            list:action.chupai,
            userid:action.chuPaiPeople,
            pais:action.pais,
            you:action.you
            
        };
        this.dispatchEvent('chupai',{data:data});
    },

    operate:function(action){
        this.dispatchEvent('showClock',{seatid:action.chuPaiPeopleSeatid});
    },
    doSanAction(action){
        this.dispatchEvent('sanAction',{data:action});
    },
    // doPushlun:function(action){
    //     this.dispatchEvent('pushLun',{data:action});
    // },

    // showMiners:function(action){
    //     this.dispatchEvent('showMiners',{data:action});
    // },

    // showFriend:function(action){
    //     this.dispatchEvent('showFriend',{data:action});
    // }
    // update (dt) {},
});
