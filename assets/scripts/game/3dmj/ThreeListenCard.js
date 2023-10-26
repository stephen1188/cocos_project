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
        tingpailistchipic.getComponent(cc.Sprite).spriteFrame = cc.vv.mahjongMgr.getSpriteFrameByMJID("M_",_tingpai);
        tingpailistchifan.getComponent(cc.Label).string=_tingpaifan + "张";
        if(_tingpai == cc.vv.mahjongMgr._magicPai || _tingpai == cc.vv.mahjongMgr._magicPai2){
            var magic_mash=this.node.getChildByName('magic_mash');
            magic_mash.active = true;
        }
    },
    fan:function(_tingpaifan){
        var tingpailistchifannew = this.node.getChildByName('fanshunew');
        tingpailistchifannew.active = true;
        var Xfan = this.node.getChildByName('Xfan');
        Xfan.active = true;
        tingpailistchifannew.getComponent(cc.Label).string=_tingpaifan + "番";
    }
});
 