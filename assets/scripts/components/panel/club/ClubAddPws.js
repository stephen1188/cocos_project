cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad:function(){
        //cc.vv.utils.addClickEvent(this.node,this.node,"AddPws","onBtnClicked");
    },

    onBtnClicked:function(event){
        cc.vv.club._clubSet.getComponent('ClubSetting').addRule();
    }

    // update (dt) {},
});
