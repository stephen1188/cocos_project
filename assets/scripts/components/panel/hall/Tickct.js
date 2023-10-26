const URL = ""
cc.Class({
    extends: cc.Component,

    properties: {
        idLabel: cc.Label,
        imgNode: cc.Node,
    },
    start(){
        if(!cc.vv.userMgr.shareConfig){
            return;
        }
        this.idLabel.string = cc.vv.userMgr.shareConfig.kf_id?cc.vv.userMgr.shareConfig.kf_id:"";
     
        let self = this;
        cc.loader.load(cc.vv.userMgr.shareConfig.kf_url, function (err, texture) {
            if(err){
                return;

            }
            let frame = new cc.SpriteFrame(texture);
            if (self.imgNode.isValid){
                self.imgNode.getComponent(cc.Sprite).spriteFrame = frame;
            }
        });
     
    },
    btnCopyClicked:function(){
        cc.vv.audioMgr.click();
        if(!cc.vv.userMgr.shareConfig.kf_id){
            return;
        }
        cc.vv.g3Plugin.copyText(cc.vv.userMgr.shareConfig.kf_id);
        cc.vv.popMgr.alert("复制内容(" + cc.vv.userMgr.shareConfig.kf_id + ")成功");
    },
    onBtnClickOpenKeFu(){
        cc.sys.openURL(cc.GAMEKEFU);
    },
});
