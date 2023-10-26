cc.Class({
    extends: cc.Component,

    properties: {
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        //走马灯
        var x = this.node.x;
        x -= dt*100;
        if(x + this.node.width < -1000){
            x = 500;
        }
        this.node.x = x;
    },
});
