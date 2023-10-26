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
    prepareReplay:function(data){
        
        cc.vv.roomMgr.param.guo = data.guo;
        this.dispatchEvent("param",{data:cc.vv.roomMgr.param});
        cc.vv.roomMgr.real = cc.vv.roomMgr.enter.real;
    },

    dispatchEvent(event,data){
        if(this.node){
            this.node.emit(event,data);
        }    
    },

    //分发发牌
    doFapai:function(data){
        var length = data.length;
        for (let index = 0; index < length; index++) {
            var wamfa = cc.vv.roomMgr.param.wanfa;
            var viewid = cc.vv.roomMgr.viewChairID(index);
            if (viewid == 0) {
                if(wamfa == 1){
                    var pai = data[index];
                    pai[2] = 0;
                    this.dispatchEvent("fapai_1", {data:{pai:pai}});
                }
            }
        }
      
    },

    //分发定庄
    doDingZhuang:function(data){
        //{"seatid":1,"power":0,"list":{"0":1,"1":1,"2":0,"3":0,"4":0},
        var qiang = data.qiang;
        var zhuang = data.zhuang;
        var list = {};
        for (let index = 0; index < qiang.length; index++) {
             var indexName = index + "";
             list[indexName] = qiang[index];
        }
        this.dispatchEvent("dingzhuang", {data:{seatid:zhuang,list:list}});
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
        //{"errcode":0,"data":{"round":1,"pai":[10,26,27,6,25],"max_round":10},"errmsg":"ok","model":"game","event":"fapai_2"}
        var length = cc.vv.roomMgr.real;
        for(let index = 0; index < length; index++) {
            var viewid = cc.vv.roomMgr.viewChairID(index);
            if(viewid == 0){
                this.dispatchEvent("fanpai", {data:{seatid:index,pai:data[index]}});
            }
        }
    }
});
