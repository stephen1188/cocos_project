cc.Class({
    extends: cc.Component,

    properties: {
        sprHelp:cc.Sprite,
        scrollView:cc.ScrollView,
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
