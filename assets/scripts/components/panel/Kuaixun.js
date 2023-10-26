cc.Class({
    extends: cc.Component,

    properties: {
        lblContent:cc.Label,
    },

    kuaixun:function(content){

        this.lblContent.string = content;
        this.node.y = 375;
        this.node.width = this.lblContent.node.width + 150;

        cc.vv.audioMgr.playSFX("kuixun");

        this.node.runAction(
            cc.sequence(
                cc.moveBy(0.05,cc.v2(0,-80)),
                cc.delayTime(3.0),
                cc.moveBy(0.05,cc.v2(0,80)),
                cc.removeSelf()
            )
        );
    },

});
