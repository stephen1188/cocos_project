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
        watch_item:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    show_list:function(table_list){
        if(cc.vv.roomMgr.guanzhan_table){
            var content = this.node.getChildByName("view").getChildByName("content");
            content.removeAllChildren();
            var show_tips = true;
            for(var i = 0;i < table_list.length;i++){
                if(table_list[i].userid != 0){
                    if(show_tips ==  true){
                        show_tips = false;
                    }
                    var node_item = cc.instantiate(this.watch_item);
                    node_item.getChildByName("head").getComponent(cc.Sprite).spriteFrame = node_item.getChildByName("head").getComponent("ImageLoader").loadImg(table_list[i].headimg);
                    // node_item.getChildByName("head").getChildByName("bg").scaleX = 1.2;
                    // node_item.getChildByName("head").getChildByName("bg").scaleY = 1.2;
                    node_item.getChildByName("name").getComponent(cc.Label).string = cc.vv.utils.cutString(table_list[i].nickname,6);
                    node_item.getChildByName("id").getComponent(cc.Label).string = "ID: " + table_list[i].userid;
                    content.addChild(node_item);
                } 
            }
            this.node.getChildByName("tips").active = show_tips;
            
        }
    },
    onBtnClicked: function (event, data) {
        switch (event.target.name) {
            case "Mask": {
                
                this.node.active = false;
            }
            break;
        }
    },
    // update (dt) {},
});
