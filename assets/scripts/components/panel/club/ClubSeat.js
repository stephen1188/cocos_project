cc.Class({
    extends: cc.Component,

    properties: {
      head:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var self = this;
        this.node.on('new',function(ret){
            var data = ret;
            self.head.getComponent("ImageLoader").loadImg(data.headimg);
        });
    },

   

    // update (dt) {},
});
