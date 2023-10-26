cc.Class({
    extends: cc.Component,

    properties: {
        roomid:cc.Label,
        desc:cc.Label,
        time:cc.Label,
        players:cc.Label,
        status:cc.Sprite,
        statusAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        _status:0,
        _name:{
            default: "",
            tooltip: "my name",
            override: true
        },
    },

    onLoad(){

        var self = this;

        //监听
        this.node.on('new',function(ret){
            var data = ret;
            self.node.myTag = data.roomid;
            self._name = data.name;
            self.roomid.string = data.roomid;
            self.desc.string = data.desc;
            self.time.string = data.time;
            self.players.string = '';
            self._status = data.status;

            var list = JSON.parse(data.players);
            for(var i=0;i<list.length;++i){
                self.players.string = self.players.string + list[i].nickname + "\n";
            }

            self.status.spriteFrame = self.statusAtlas.getSpriteFrame("opened_status_"+data.status);        
        });

        //监听
        this.node.on('opened_room_remove',function(ret){
            var data = ret;
            if(data.errcode == -98){
                cc.vv.popMgr.alert("房间正在游戏中，您是否确认要强制解散？",function(){
                    self.sendRemove(1);
                },true);
                return;
            }

            if(data.errcode != 0){
                cc.vv.popMgr.alert(data.errmsg);
                return;
            }

            //成功删除
            self.node.destroy(); 
            cc.vv.popMgr.alert("房间[" + self.roomid.string + "]解散完成");
        });
    },

    //根据选择分享不同内容
    share:function(type,obj,roomid){
        // var platform = parseInt(type);
        // var title = cc.GAME_NAME + "房间号：" + cc.vv.roomMgr.roomid;
        // var text = "玩法:" + cc.vv.roomMgr.enter.desc;
        // var url = 'http://download.ccplays.com/app/jale';
        // var imgurl = jsb.fileUtils.fullPathForFilename('res/raw-assets/resources/public/dairy_icon.png');
        // cc.vv.g3Plugin.shareWeb(platform,title,text,imgurl,url);

        // var cntUser = 0;
        // for (var i = 0; i < cc.vv.roomMgr.table.list.length; i++) {
        //     if (cc.vv.roomMgr.table.list[i].userid > 0) {
        //         cntUser++;
        //     }
        // }

        var platform = parseInt(type);
        var title = cc.GAME_NAME + "房间号：" + roomid;
        // if(cc.vv.roomMgr.ren != cntUser){
        //     title = title + ' [缺' + ( cc.vv.roomMgr.ren - cntUser) + "人]";
        // }

        var text = "玩法:" + obj.desc.string;
        var url = cc.GAMEADRESS;
        var imgurl = jsb.fileUtils.fullPathForFilename('res/raw-assets/resources/public/dairy_icon.png');
        cc.vv.g3Plugin.shareWeb(platform,title,text,imgurl,url);
    },

    //邀请按扭
    btnInviteClicked(event,data){
        var self = this;
        cc.vv.popMgr.open("Share",function(obj){
            obj.getComponent("Share").onhideshare(1);
            obj.getComponent("Share").share(self.share,self,self.roomid.string);
        });
    },

    //删除按钮
    btnRemoveClicked(event,data){
        var self = this;
        if(this._status == 1){
            cc.vv.popMgr.alert("房间正在游戏中，您是否确认要强制解散？",function(){
                self.sendRemove(1);
            },true);
        }else{
            cc.vv.popMgr.alert("您确定解散这个代开房吗？",function(){
                self.sendRemove(0);
            },true);
            
        }
    },

    sendRemove:function(force){
        var info = {
            method:"opened_room_remove",
            data:{
                roomid:this.roomid.string,
                force:force,
            }
        };
        cc.vv.net1.send(info);
    }
});
