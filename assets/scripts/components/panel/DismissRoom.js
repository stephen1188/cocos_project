cc.Class({
    extends: cc.Component,

    properties: {
        nodeList:cc.Node,
        nodeList2:cc.Node,
        context:cc.Label,
        disroomItem:cc.Prefab,
        time:cc.Label,
        btnTongyi:cc.Button,
        btnJujue:cc.Button,
        _endTime:-1,
    },

    onLoad(){
        //监听
        this.initEventHandlers();
    },

    //监听协议
    initEventHandlers:function(){

        //初始化事件监听器
        var self = this;

        this.node.on("init",function(ret){
            self.table = ret.table;
        }),

        //拒绝解散
        this.node.on('refuse_dismiss_room',function(ret){
            self.node.removeFromParent();
        });

        //同意解散
        this.node.on('agree_dismiss_room',function(ret){
            var data = ret;
            self.show(data.list);
        });

        //请求解散
        this.node.on('try_dismiss_room',function(ret){
            var is_watch_game = false;
           
            if(!cc.vv.roomMgr.is_replay && cc.vv.roomMgr.guanzhan_table != null){
                var watch_list = cc.vv.roomMgr.guanzhan_table.list;
                for(var i = 0;i < watch_list.length;i++){
                    if(watch_list[i].userid != 0){
                        if(watch_list[i].userid == cc.vv.userMgr.userid){
                            is_watch_game = true;
                        }
                    }
                }
            }
            if(cc.vv.roomMgr.table){
                var table_list = cc.vv.roomMgr.table.list;
                for(var i = 0;i < table_list.length;i++){
                    if(table_list[i].userid != 0){
                        if(table_list[i].sitStatus == 1){
                            var is_viewid = cc.vv.roomMgr.viewChairID(table_list[i].seatid);
                            if(is_viewid == 0){
                                is_watch_game = true;
                            }
                        }
                    }
                }
            }
         
            if(is_watch_game == true){
                self.node.getChildByName("watch_back").active = true;
            }else{
                self.node.getChildByName("watch_back").active = false;
            }
            
            var data = ret;
            self.context.string = data.nickname + " 请求解散";
            self._endTime = data.time;
            //self.time.string = data.time;
            self.show(data.list);
        });
    },
    
    btn_back:function(){
        this.node.active = false;
    },
    show:function(list){
        var self = this;
        this.nodeList.removeAllChildren();
        this.nodeList2.removeAllChildren();
        for(var i=0;i<list.length;++i){

            if(list[i].userid ==0)continue;

            //显示每个人的状态
            list[i].headimg = cc.vv.game.table.seat_img(cc.vv.roomMgr.viewChairID(i));
            var node = cc.instantiate(this.disroomItem);
            if (cc.vv.roomMgr.ren > 5){
                this.nodeList2.addChild(node);
            }else{
                this.nodeList.addChild(node);
            }
            node.emit("show",list[i]);
            //自己已经选择，隐藏
            if(list[i].userid == cc.vv.userMgr.userid){
                if(list[i].status != 0){
                    this.btnJujue.node.active = false;
                    this.btnTongyi.node.active = false;
                }else{
                    this.btnJujue.node.active = true;
                    this.btnTongyi.node.active = true; 
                }
            }
        }
        var is_watch_game = false;
        if(cc.vv.roomMgr.guanzhan_table){
            var watch_list = cc.vv.roomMgr.guanzhan_table.list;
            for(var j = 0;j < watch_list.length;j++){
                if(watch_list[j].userid != 0){
                    if(watch_list[j].userid == cc.vv.userMgr.userid){
                        is_watch_game = true;
                    }
                }
            }
        }
        if(is_watch_game){
            this.btnJujue.node.active = false;
            this.btnTongyi.node.active = false; 
        }
    },

    //按钮操作
    onBtnClicked:function(event,data){
        if(event.target.name =="btn_tongyi" || event.target.name =="btn_jujue"){
            if(cc.vv.roomMgr.guanzhan_table){
                var watch_game = cc.vv.roomMgr.guanzhan_table.list;
                for(var i = 0;i < watch_game.length; i++){
                    if(watch_game[i].userid == cc.vv.userMgr.userid){
                        this.node.getChildByName("btn").active = false;
                        this.node.getChildByName("btn_back").active = false;
                        cc.vv.popMgr.tip('您是观战玩家无法操作！');
                    }
                }
            }
        }
        switch(event.target.name){
            case "btn_tongyi":{
                cc.vv.net2.quick("agree_dismiss_room");

            }
            break;
            case "btn_jujue":{
                cc.vv.net2.quick("refuse_dismiss_room");
            }
            break;
        }
    },
    update: function (dt) {
        if(this._endTime > 0){
            var lastTime = (this._endTime - Date.now()) / 1000;
            if(lastTime <= 0){
                this._endTime = -1;
            }
            
            var m = Math.floor(lastTime / 60);
            var s = Math.ceil(lastTime - m*60);
            
            var str = "";
            if(m > 0){
                str += m + "分"; 
            }
            this.time.string = str + s + '秒后自动解散房间';
        }
    },
});
