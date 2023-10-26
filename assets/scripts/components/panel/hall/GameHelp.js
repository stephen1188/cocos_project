cc.Class({
    extends: cc.Component,

    properties: {
        sprHelp:cc.Sprite,
        scrollView:cc.ScrollView,
    },
    start(){
        this.onLoadHelp("tdh1600");

        if(cc.APP_STORE_REVIEW == 1 && cc.vv.userMgr.ios_review == 1  && cc.sys.os == cc.sys.OS_IOS){
            this.node.getChildByName("list").getChildByName("view").getChildByName("content").getChildByName("kd1700").active = false;
            this.node.getChildByName("list").getChildByName("view").getChildByName("content").getChildByName("ddz1800").active = false;
        }
    },

    onBtnClicked(event,data){
        cc.vv.audioMgr.click();
        var name = event.target.name;
        this.onLoadHelp(name);
    },

    onLoadHelp:function(type){
        var self = this;
        cc.loader.loadRes('hall/help/' + type,cc.SpriteFrame,function(err,spriteFrame){
			if(err){
				cc.error(err);
			}else{
                self.sprHelp.spriteFrame = spriteFrame;
                self.scrollView.scrollToTop(0);
			}
        });
    },
});
