cc.Class({
    extends: cc.Component,

    properties: {
       list:cc.Node,
       item:cc.Prefab,
    },

    onLoad:function(){
        if(cc.winSize.width / cc.winSize.height - 16 / 9 > 0.1){ 
            var width = cc.winSize.width;
            this.node.width = width;
        }
    },

    show:function(){
        this.list.removeAllChildren();
        cc.vv.popMgr.wait("正在获取成员列表",function(){
            cc.vv.net1.quick("club_users",{club_id:cc.vv.userMgr.club_id,type:3});
        });
    },

    getMsgList:function(list){
        this.list.removeAllChildren();
        for(var i = 0; i < list.length; ++i){
            var node = cc.instantiate(this.item);
            node.myTag = list[i].userid;
            this.list.addChild(node);
            node.getComponent('ApplyManage').show(list[i]);
        }
    },

    removeUser:function(userid){
        var node = cc.vv.utils.getChildByTag(this.list,userid);
        if(node !== null){
            node.destroy();
        }
    },

    onDestroy:function(){
        cc.vv.club.clubNotice = 0;
    }

    // update (dt) {},
});
