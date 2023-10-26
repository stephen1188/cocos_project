cc.Class({
    extends: cc.Component,

    properties: {
        toggles:cc.Node,
        list:cc.Node,
        histrylist:cc.Node,
        lists:cc.Node,
        item:cc.Prefab,
        historyItem5:cc.Prefab,
        historyItem10:cc.Prefab,
    },

    onLoad(){
        var type = this.toggles.getChildByName("opened").name;
        cc.vv.utils.setToggleChecked(this.toggles,type);
        this.onBtnleiXingXuanZe(null,type);
        this.initEventHandlers();
    },

    onEnable:function(){
        var type = this.toggles.getChildByName("opened").name;
        cc.vv.utils.setToggleChecked(this.toggles,type);
        
        this.onBtnleiXingXuanZe(null,type);
    },

    initEventHandlers:function(){
        var self = this;

        //监听
        this.node.on('show',function(){
            var get = {
                method:"opened_room_list",
                data:{
                }
            };
            cc.vv.net1.send(get);
        });

        //监听
        this.node.on('opened_room_list',function(data){
            self.OpenedRoomList(data);
        });

        this.node.on('opened_room_change',function(data){
            self.OpenedRoomChange(data);
        });

        this.node.on('opened_room_remove',function(data){
            self.OpenedRoomRemove(data);
        });

        this.node.on('opened_room_history',function(data){
            self.OpenedRoomHistory(data);
        });
    },

    OpenedRoomHistory:function(list){
        this.histrylist.removeAllChildren();
        for(var i = 0; i < list.length; ++i){
            if(list[i].uids == 'null'){
                continue;
            }
            var scores = list[i].scores.split(',');
            var ren = scores.length;
            var node = ren <= 5 ? cc.instantiate(this.historyItem5) : cc.instantiate(this.historyItem10);
            this.histrylist.addChild(node);
            //node.emit('history',list[i]);
            node.getComponent('HIstoryItem').history(list[i]);
        }
    },
     /**
     * 类型选择
     */
    
    onBtnleiXingXuanZe:function(event,detail){
        if(event != null){
            cc.vv.audioMgr.click();
        }
        if(detail == null)detail = event.target.name;
        for(var i = 0; i < this.lists.children.length; ++i){
            var name = this.lists.children[i].name;
            this.lists.children[i].active = (detail == name);
        }
        if(event != null){
            switch(event.target.name){
                case 'opened':{
                    cc.vv.net1.quick('opened_room_list');
                }
                break;
                case 'history':{
                    cc.vv.net1.quick('opened_room_history',{pay_way:1});
                }
                break;
            }
        }
    },

    //处理开房列表
    OpenedRoomList:function(list){
        this.list.removeAllChildren();
        for(var i = 0; i < list.length; ++i){
            var node = cc.instantiate(this.item);
            this.list.addChild(node);
            node.emit("new",list[i]);
        }
    },

    //个别房间有更新
    OpenedRoomChange:function(data){
        var node = cc.vv.utils.getChildByTag(this.list,data.roomid);
        if(node){
            node.emit("new",data);
        }
    },

    //个别房间删除
    OpenedRoomRemove:function(data){
        var node = cc.vv.utils.getChildByTag(this.list,(data.data.roomid));
        if(node){
            node.emit("opened_room_remove",data);
        }
    }

});
