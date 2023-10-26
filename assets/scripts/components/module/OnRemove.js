cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        var btn = this.node.getChildByName("btn_back");
        if(btn == null){
            if(this.node.getChildByName("btns") != null){
                btn = this.node.getChildByName("btns").getChildByName("btn_back");
            }
           
        }
        cc.vv.utils.addClickEvent(btn,this.node,"OnRemove","onBtnClicked");        
    },
    
    onBtnClicked:function(event){
        cc.vv.audioMgr.click();
        if(event.target.name == "btn_back"){
            cc.vv.utils.popRemove(this.node);   
            //this.node.destroy();
        }
    }
});
