cc.Class({
    extends: cc.Component,

    properties: {
        list_club:cc.Node,
        list_item:cc.Node,
        today:cc.Label,
        day15:cc.Label,
        uid:cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(cc.winSize.width / cc.winSize.height - 16 / 9 > 0.1){ 
            var width = cc.winSize.width;
            this.node.width = width;
        }
    },

    onEnable:function(){
        // var type = this._toggles.children[0].name;
    },

    show:function(data){
        this.allUsers(data);
    },

    allUsers:function(data){
        this.uid.string = data.player_id
        this.today.string = data.todayReward
        this.day15.string = data["day15Reward"]
        let datalist = data.list
        var node = cc.instantiate(this.list_item);
        this.list_club.removeAllChildren();
        var list = data.list;
        for(var i = 0; i < datalist.length; ++i){
            node.getChildByName("time").getComponent(cc.Label).string = datalist[i].created
            node.getChildByName("nickname").getComponent(cc.Label).string = datalist[i].name
            node.getChildByName("id").getComponent(cc.Label).string = datalist[i].source_id
            node.getChildByName("reward").getComponent(cc.Label).string = datalist[i].reward
            this.list_club.addChild(node);
        }
    },
    // update (dt) {},
});
