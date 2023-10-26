
cc.Class({
    extends: cc.Component,

    properties: {
    
    },

    onLoad () {

        //监听协议
        this.initEventHandlers();
    },

    start () {

        
    },

    initEventHandlers:function(){
        var self = this;
        //准备
        this.node.on("xipai",function(data){
            self.xipaiAnimation(data);
        });
    },

    xipaiAnimation(data){
        var TJDAllPai = this.node.children;
        for (let index = 0; index < data.indexY; index++) {
            for (let indexTwo = 0; indexTwo < data.indexX; indexTwo++) {
                var myTag = index + "_" + indexTwo;
                var TJDAllPaiItem = cc.vv.utils.getChildByTag(this.node,myTag);
                if(index == 1 || index == 3){
                    TJDAllPaiItem.runAction(cc.moveBy(0.2, 0, -84));
                }
                if(index == 0 ||index == 1){
                    function callback(){
                        if(data.callback != null){
                            data.callback(index, indexTwo);
                        }
                    }
                    TJDAllPaiItem.runAction(cc.sequence(cc.delayTime(0.2), cc.moveBy(0.2, 0, -72),cc.callFunc(callback)));
                }else{
                    function callback(){
                        if(data.callback != null){
                            data.callback(index, indexTwo);
                        }
                    }
                    TJDAllPaiItem.runAction(cc.sequence(cc.delayTime(0.2), cc.moveBy(0.2, 0, 72),cc.callFunc(callback)));
                }
            }
        }
    },
});
