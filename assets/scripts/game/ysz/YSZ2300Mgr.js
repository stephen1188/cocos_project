cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    onLoad:function(){
        //监听协议
        this.initEventHandlers();
    },

    initEventHandlers:function(){

        //初始化事件监听器
        var self = this;
    },

    /**
     * 回放预赋值
     */
    prepareReplay:function(){
        
        this.dispatchEvent("param",{data:cc.vv.roomMgr.param});
        cc.vv.roomMgr.real = cc.vv.roomMgr.enter.real;
    },

    dispatchEvent(event,data){
        if(this.node){
            this.node.emit(event,data);
        }    
    },

    //分发发牌
    doFapai:function(data,seatid){
        var length = data.length;
        for (let index = 0; index < 1; index++) {  
            var wamfa = cc.vv.roomMgr.param.wanfa;
            var viewid = cc.vv.roomMgr.viewChairID(seatid);
            this.dispatchEvent("fapai_1", {data:{hand:data.hand}});
        }
    },
    
    //分发定庄
    room_pwb_change:function(data){
        this.dispatchEvent("room_pwb_change", {data:data});
    },
    //分发定庄
    beginFen:function(data){
        this.dispatchEvent("beginFen", {data:data});
    },
    //分发跟注
    genZhu:function(data){
        this.dispatchEvent("genZhu", {data:data});
    },
    //分发加注
    jiaZhu:function(data){
        this.dispatchEvent("jiaZhu", {data:data});
    },
    //分发加注
    bipai:function(data){
        this.dispatchEvent("bipai", {data:data});
    },
    //分发看牌
    cheat:function(data){
        this.dispatchEvent("cheat", {data:data});
    },
    //分发看牌
    kanpai_1:function(data){
        this.dispatchEvent("kanpai_1", {data:data});
    },
    //分发看牌
    gameEndKaiPai:function(data){
        this.dispatchEvent("kaipai", {data:data});
    },
    //分发弃牌
    qipai:function(data){
        this.dispatchEvent("qipai", {data:data});
    },
    //更新
    pushLun:function(data){
        this.dispatchEvent("pushLun", {data:data});
    },
    //回放发牌
    replay_deal_fapai:function(data){
        this.dispatchEvent("replay_deal_fapai", {data:data});
    },
    //分发下注
    doXiaZhu:function(data){
        var length = data.length;
        for(let index = 0; index < length; index++) {
            if(data[index] != 0){
                this.dispatchEvent("xiazhu", {data:{seatid:index,power:data[index]}});
            }
        }
    },

    //分发开牌
    doKaipai:function(data){
        var length = cc.vv.roomMgr.real;
        for(let index = 0; index < length; index++) {
            var viewid = cc.vv.roomMgr.viewChairID(index);
            if(viewid == 0){
                this.dispatchEvent("fanpai", {data:{seatid:index,pai:data[index]}});
            }
        }
    }
});
