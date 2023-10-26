cc.Class({
    extends: cc.Component,

    properties: {
        list:cc.Node,
        messageItem:cc.Prefab,
    }, 

    message:function(list){
        this.list.removeAllChildren();
        for(var i = 0; i < list.length; ++i){
            var node = cc.instantiate(this.messageItem);
            node.myTag = list[i].id;
            this.list.addChild(node);
            node.emit("new",list[i]);
        }
    },

    removeMsg:function(id){
        var node = cc.vv.utils.getChildByTag(this.list,id);
        if(node !== null){
            node.destroy();
        }
    },

    refreshMsg:function(id){
        var node = cc.vv.utils.getChildByTag(this.list,id);
        if(node !== null){
            node.getComponent('MessageItem').setStatus();
        }
    },

    onDestroy:function(){
        cc.vv.hall.msgType = 0;
        cc.vv.net1.quick("message_list");
    }
});
