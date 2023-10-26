cc.Class({
    extends: cc.Component,

    properties: {
    },


    onLoad:function(){

        var canvas = this.node.getComponent(cc.Canvas);
        if(cc.winSize.width / cc.winSize.height - 16 / 9 > 0.1){ 
            canvas.fitHeight = true;
            canvas.fitWidth = false;
            this.node.getChildByName('bg').width  = cc.winSize.width;
        }else{
            canvas.fitHeight = false;
            canvas.fitWidth = true;
        }
    },
});
