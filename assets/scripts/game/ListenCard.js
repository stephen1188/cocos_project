// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

     onLoad () 
     {

     },

    start () {

    },
    show:function(_tingpai,_tingpaifan)
    {
        var tingpailistchipic=this.node.getChildByName('MyMahJongPai');
        var tingpailistchifan=this.node.getChildByName('fanshu');
        tingpailistchipic.getComponent(cc.Sprite).spriteFrame =cc.vv.mahjongMgr.getSpriteFrameByMJID("M_",_tingpai);
        tingpailistchifan.getComponent(cc.Label).string=_tingpaifan;
    },
    // update (dt) {},
});
 