cc.Class({
    extends: cc.Component,

    properties: {
        img:cc.Sprite,
        _target:cc.Node,
    },

    init:function(myTag,spriteFrame,func){
        this.myTag = myTag;
        this._target = func;
        this.img.spriteFrame = spriteFrame;
    },

    onBtnClicked:function(event,data){
        cc.vv.net2.quick("biaoqing",{index:this.myTag+""});
        this._target.active = false;
    }
});
