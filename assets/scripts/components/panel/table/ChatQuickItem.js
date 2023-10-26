cc.Class({
    extends: cc.Component,

    properties: {
        info:cc.Label,
        _target:cc.Node,
    },

    init:function(myTag,info,target){
        this.myTag = myTag;
        this._target = target;
        this.info.string = info; 
    },

    onBtnClicked:function(event,data){
        cc.vv.net2.quick("yuyin",{index:this.myTag,content:this.info.string});
        this._target.active = false;
    }
});
