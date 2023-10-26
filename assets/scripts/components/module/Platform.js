cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad:function(){
        cc.vv.platform = this;
    },

    start () {
        this.androidListener();
    },

    /**
     * 安卓手机 返回键监听
     */
    androidListener:function(){
        
        //只做安卓的检测
        if(cc.sys.os != cc.sys.OS_ANDROID){
            return;
        }
        var keyboardListener = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event){
                if(cc.vv.moreGame){
                    return;
                };
                if(keyCode == cc.macro.KEY.back){
                    cc.vv.popMgr.alert("才玩一会会儿的，您真的要离开吗？",function(){
                        // cc.director.end();  
                        cc.director.pause();
                        cc.audioEngine.stopAll();
                        if(cc.director.isPaused()) {
                            cc.game.end();
                        }
                    },true);

                }
            }
        });

        cc.eventManager.addListener(keyboardListener, this.node);
    },

    //下单
    order:function(){
        if(cc.APP_STORE_REVIEW == 1 && cc.vv.userMgr.ios_review == 1  && cc.sys.os == cc.sys.OS_IOS){
            cc.vv.popMgr.open("hall/Shopping");
        }else{
            cc.vv.popMgr.open("hall/Ticket");
        }
    }
});
