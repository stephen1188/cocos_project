
cc.Class({
    extends: cc.Component,

    properties: {

    },
    onLoad () {
        if(this.node.name == "Pwb_tips"){
            return;
        }
        if(cc.winSize.width / cc.winSize.height - 16 / 9 > 0.1){ 
            var width = cc.winSize.width;
            this.node.width = width;
        }
    },
    onBtnoClick:function(){
        this.node.active = false;
    },

    start () {
        
    },

    // update (dt) {},
});
