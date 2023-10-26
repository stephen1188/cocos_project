
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        var btn = this.node.getChildByName("btn_back");
        if(btn == null){
            btn = this.node.getChildByName("btns").getChildByName("btn_back");
        }
        cc.vv.utils.addClickEvent(btn,this.node,"onSlideHide","onBtnClicked");        
    },
    
    onBtnClicked:function(event){
        cc.vv.audioMgr.click();
        if(event.target.name == "btn_back"){
            this.btn_node_back(this.node);
        }
    },
    btn_node_back:function(node){
        var self = this;
        node.opacity = 255;
        node.y = 0;
        node.runAction(cc.sequence(
            cc.spawn(
                cc.moveTo(0.2,cc.v2(0,750)),
                cc.fadeTo(0.2,0),  
            ),
            cc.callFunc(function () {
                node.active = false;
                node.opacity = 255;
                node.y = 0;
            },)
        ));
    },
    // update (dt) {},
});
