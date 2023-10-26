

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
        this.dispatchEvent('parma',{data:cc.vv.roomMgr.param});

        cc.vv.roomMgr.real = cc.vv.roomMgr.enter.real;
    },

    dispatchEvent(event,data){
        if(this.node){
            this.node.emit(event,data);
        }
    },
    

    //抢庄
    doQiang:function(data){
        var qiang = data.qiang;
        var zhuang = data.zhuang;
        var list = {};
        for (var index = 0; index < qiang.length; index++) {
             var indexName = index + "";
             list[indexName] = qiang[index];
        }
        this.dispatchEvent("dingzhuang", {data:{seatid:zhuang,list:list}});
    },

    //色子动画
    doDingZhuang:function(data){
        this.dispatchEvent("fapai",{data:{num:[data.touzi[0],data.touzi[1]], xiPai:0, mingpai:data.mingpai}});
    },

    //分发停止要摇动色子
    doGetEnd:function(data){

        this.dispatchEvent("getEnd");
    },

    //下注
    doXiaZhu:function(data){
        var length = data.length;
        // for(var index = 0; index < length; index++) {
        //     if(data[i][0] == -1){
        //         continue;
        //     }
        //     if(data[index] != 0){
        //         this.dispatchEvent("xiazhu", {data:{seatid:index,power:data[index]}});
        //     }
        // }
        this.dispatchEvent("showAllXiazhu", {data:{xiazhu:data,nextDao:1}})
    },
    //开牌
    doKaipai:function(data){
        var length = cc.vv.roomMgr.real;
        for(let index = 0; index < length; index++) {
            var viewid = cc.vv.roomMgr.viewChairID(index);
            this.dispatchEvent("kaipai", {data:{seatid:index,hand:data.data[index],type:data.type[index]}});
        }
    }

});
