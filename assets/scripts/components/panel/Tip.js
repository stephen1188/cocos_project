cc.Class({
    extends: cc.Component,

    properties: {
    },
    
    tip:function(content,delaytime=1.5){
        this.node.getChildByName("popbg").getChildByName("content").getComponent(cc.Label).string = content;
        // this.node.getChildByName("popbg").width = this.node.getChildByName("content").width + 200;
        this.node.runAction(
            cc.sequence(
                cc.spawn(
                    cc.fadeIn(0.1),
                    cc.moveBy(0.1,cc.v2(0,20))
                ),
                cc.delayTime(delaytime),
                cc.spawn(
                    cc.fadeOut(0.1),
                    cc.moveBy(0.1,cc.v2(0,20))
                ),
                cc.removeSelf()
            )
        );
    },
});
