cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.lblGems = this.node.getChildByName("btn_ticket").getChildByName("num").getComponent(cc.Label);
    },

    /**
     * 刷新大厅显示
     */
    initLabels:function(){
        //用户名，ID
        this.node.getChildByName("username").getComponent(cc.Label).string = cc.vv.userMgr.userName;
        this.node.getChildByName("userid").getComponent(cc.Label).string = "ID:" + cc.vv.userMgr.userid;
        //this.lblGems.string = cc.vv.userMgr.ticket;

        //加载头像
        this.node.getChildByName("head").getChildByName("img").getComponent("ImageLoader").loadImg(cc.vv.userMgr.headimg);

        this.refresh();
    },

    //要刷新的东西
    refresh:function(){
        if(this.lblGems)this.lblGems.string = cc.vv.userMgr.ticket;
    },

    start () {
        this.initLabels();
    },
});
