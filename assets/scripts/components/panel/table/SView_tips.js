cc.Class({
    extends: cc.Component,

    properties: {
        sView_tis_item:cc.Prefab,
    },

    onLoad(){
        this.initEventHandlers();
    },

    start () {
       
    },

    initEventHandlers:function(){
        var self = this;
        this.node.on('get_open',function(data){
            var callbck = data.callback;
            var content = self.node.getChildByName("tips_ScrollView").getChildByName("list").getChildByName("content");
            content.removeAllChildren();

            var seatDatas = cc.vv.roomMgr.table;
            var list = seatDatas.list;
            for (var index = 0; index < list.length; index++) {
                var seat = list[index];
                if(seat.userid == 0) continue;
                var seatid = seat.seatid;
                var viewid = cc.vv.roomMgr.viewChairID(seatid);
                var tis_item = cc.instantiate(self.sView_tis_item);
                var tip_name = tis_item.getChildByName("tip_name");
                var tip_id = tis_item.getChildByName("tip_id");
                //提示地址相同 处理一下昵称截断 防止广告
                tip_name.getComponent(cc.Label).string = cc.vv.utils.cutString(seat.nickname,6);
                tip_id.getComponent(cc.Label).string = seat.userid;
                
                var select_btn = tis_item.getChildByName("select_btn");

                var clickEventHandler = new cc.Component.EventHandler();
                clickEventHandler.target = self.node; //这个 node 节点是你的事件处理代码组件所属的节点
                clickEventHandler.component = "SView_tips";//这个是代码文件名
                clickEventHandler.handler = "onBtnClick";
                clickEventHandler.customEventData = {
                    seatid:seatid,
                    callbck:callbck
                };

                var button = select_btn.getComponent(cc.Button);
                button.clickEvents = [];
                button.clickEvents.push(clickEventHandler);
                content.addChild(tis_item);
            }
        });

        this.node.on('isActive',function(data){  
            var isActive = data.isActive;
            self.isActive(isActive);
            if(data.callbck){
                callbck();
            }
        });
    },

    onBtnClick:function(event, customEventData){
        var seatid = customEventData.seatid;
        var callbck = customEventData.callbck;
        cc.vv.roomMgr.seatid = seatid;
        var info = {
            isActive:false
        }
        this.isActive(info);
        if(callbck){
            callbck(seatid);
        }
    },

    isActive:function(data){
        var isActive = data.isActive;
        this.node.active = isActive;
    }
});
