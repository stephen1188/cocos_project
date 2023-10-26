cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad(){

        var self = this;

        //监听
        this.node.on('show',function(ret){
            var data = ret; 
            cc.vv.popMgr.tip("播放动画");     
        });
    },

});
