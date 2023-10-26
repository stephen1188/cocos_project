cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    onLoad:function(){
       
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
    doFapai:function(data){
        var length = data.length;
        for (let index = 0; index < length; index++) {
            var wamfa = cc.vv.roomMgr.param.wanfa;
            var viewid = cc.vv.roomMgr.viewChairID(index);
            if (viewid == 0) {
                if(wamfa == 1){
                    var pai = data[index];
                    pai[4] = 0;
                    this.dispatchEvent("fapai_1", {data:{pai:pai}});
                }else if(wamfa == 2){
                    var pai = data[index];
                    pai[3] = 0;
                    pai[4] = 0;
                    this.dispatchEvent("fapai_1", {data:{pai:pai}});
                }else{
                    var pai = data[index];
                    this.dispatchEvent("fapai_1", {data:{pai:pai}});
                }
            }
        }
      
    },

    //分发定庄
    doDingZhuang:function(data){
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
        var length = cc.vv.roomMgr.real;
        for(let index = 0; index < length; index++) {
            var viewid = cc.vv.roomMgr.viewChairID(index);
            if(viewid == 0){
                this.dispatchEvent("fanpai", {data:{seatid:index,pai:data[index]}});
            }
        }
    }
});
