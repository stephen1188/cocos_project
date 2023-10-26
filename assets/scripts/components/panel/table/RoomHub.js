cc.Class({
    extends: cc.Component,

    properties: {
        wifi:cc.Sprite,
        time:cc.Label,
        text_roomid:cc.Node,
        roomid:cc.Label,
        club:cc.Label,
        desc:cc.Label,
        bg:cc.Node,
        nodePower:cc.Node,
        titlebg:cc.Node,
        wang:cc.Node,
        _winChat:cc.Node,
        _desc:"",
        _Location:null,
    },

    onLoad(){

        var self = this;
        this._winChat = cc.find("Canvas/open/Chat");

        //监听
        this.initEventHandlers();
    },

    start(){
        this.timeInterval();

        this.node.emit("power");
        this.node.emit("network");
        this.node.getChildByName("oper").getChildByName("btn_yuyin").active = false
    },

    //定时更新时间
    timeInterval(){
        var self = this;

        var func = function(){
            self.hudTime();
        }

        func();

        this.inter = setInterval(function(){
            func();
        },10000);
    },

    onDestroy(){
        clearInterval(this.inter);
    },

    //更新时间
    hudTime(){
        //刷新时间
        var date = new Date();
        var h = date.getHours();
        h = h < 10? "0"+h:h;
        var m = date.getMinutes();
        m = m < 10? "0"+m:m;
        this.time.string = "" + h + ":" + m; 
    },

    //监听协议
    initEventHandlers:function(){

        //初始化事件监听器
        var self = this;

        //坐到位置
        this.node.on('enter',function(data){
            self._desc = data.desc;
            self._max = cc.vv.roomMgr.now;
            self._now = cc.vv.roomMgr.now;
            self.roomid.string = data.room_id;
            self.hudDesc();

            //亲友圈不显示房号
            // if(data.clubid != 0){
            //     self.text_roomid.active = false;
            //     self.roomid.node.active = false;
            //     self.club.node.active = true;
            //     //self.club.string = cc.vv.userMgr.clublist[data.clubid].name;
            //     var objKeys = Object.keys(cc.vv.userMgr.clublist);
            //     if(objKeys.indexOf(data.clubid.toString()) != -1){
            //         self.club.string = data.club_name;
            //     }
            //     else{
            //         self.club.string = '乐圈';
            //     }
                
            // }
        });

        //坐到位置
        this.node.on('begin',function(data){
        });

        //通知更新标题
        this.node.on("round",function(data){
            self.hudDesc();
        });

        //电量
        this.node.on("power",function(data){
            
            if(cc.vv.global.power <= 0)cc.vv.global.power = 0;
            var x = (34 * cc.vv.global.power ) / 100;
            self.nodePower.width = x;

            cc.loader.loadRes("public/table/sysInfo",cc.SpriteAtlas,function( error, atlas )
            {
                var name = "info_power_g";
                if(cc.vv.global.power <= 20){
                    name = "info_power_r";
                }
                self.nodePower.getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(name);
            });

        });

        //网络信息
        this.node.on("network",function(data){

            if(cc.vv.global.net_level >3)cc.vv.global.net_level = 3;
            if(cc.vv.global.net_level <0)cc.vv.global.net_level = 0;
    
            cc.loader.loadRes("public/table/sysInfo",cc.SpriteAtlas,function( error, atlas )
            {
                var name = "info_wifi_" + cc.vv.global.net_level;
                self.wifi.spriteFrame = atlas.getSpriteFrame(name);
            });

        });
    },

    //更新标题
    hudDesc:function(){ 
        var max = cc.vv.roomMgr.max;
        var op = '/';
        if(cc.vv.roomMgr.max == -1 || cc.vv.roomMgr.max == 100000){
            max = "";
            op = '';
        }
        if(cc.vv.roomMgr.now == null){
            this.desc.string = cc.vv.roomMgr.stage.now + op + max;// + " " + this._desc;
        }else{
            this.desc.string = cc.vv.roomMgr.now + op + max;// + " " + this._desc;
        }
    },

    //复制按钮
    btnCopyClieck:function(event,data){
        cc.vv.audioMgr.click();
        var self = this;
        switch(event.target.name){
            case "btn_setting":{
                cc.vv.popMgr.open("Setting",function(obj){
                    obj.getComponent("Setting").hideButton();
                });
            }
            break;
            case "btn_wang":{
                this.wang.active = true;
            }
            break;
            case "btn_exit":{
                if(cc.vv.roomMgr.started == 0){
                    
                    if(cc.vv.roomMgr.param != null && (cc.vv.userMgr.userid == cc.vv.roomMgr.param.creator 
                        ||cc.vv.userMgr.userid == cc.vv.roomMgr.param.fangzhu) 
                        && cc.vv.roomMgr.clubid == 0){
                        cc.vv.popMgr.alert("房间未开局,解散房间将不会扣除乐豆",function(){
                            cc.vv.net2.quick("leave",{
                                room_id: cc.vv.roomMgr.roomid
                            });
                        },true);
                    }else{
                        cc.vv.popMgr.alert("您是否要确认离开房间？",function(){
                            cc.vv.net2.quick("leave",{
                                room_id: cc.vv.roomMgr.roomid
                            });
                        },true);
                    }
                }else{
                    if(cc.vv.roomMgr.guanzhan_table != null){
                        var watch_table = cc.vv.roomMgr.guanzhan_table.list;
                        for(var i =0;i < watch_table.length;i++){
                            if(watch_table[i].userid != 0 && watch_table[i].userid == cc.vv.userMgr.userid){
                                cc.vv.popMgr.alert("您是否要确认离开房间？",function(){
                                    cc.vv.net2.quick("leave",{
                                    room_id: cc.vv.roomMgr.roomid
                                });
                                },true);
                                return;
                            }
                        }
                    } 
                    cc.vv.popMgr.alert("房间已开局,是否确认要申请解散？",function(){
                        cc.vv.net2.quick("try_dismiss_room");
                    },true)
                }
            }
            break;
            case "btn_chat":{
                if(cc.vv.game.config.is_chat != null && cc.vv.game.config.is_chat == false){
                    cc.vv.popMgr.tip("本游戏禁止发送表情和互动");
                    return;
                }
                this._winChat.active = true;
            }
            break;
            case "btn_yuyin":{
                cc.vv.popMgr.open("Yuyin");
            }
            break;
            case "btn_god_wash":
            case "btn_god_luck":{
                this.wang.active = false;
                cc.vv.popMgr.open("GoodLuck",function(obj){
                    ojb.emit("show",data);
                });
            }
            break;
            case "btn_roominfo":{
                cc.vv.popMgr.pop("table/roominfo", function (obj){
                    var info = obj.getChildByName("bg").getChildByName('info');
                    info.getComponent(cc.Label).string = self._desc.replace(/ /g,"\n");
                    info.getComponent(cc.Label)._forceUpdateRenderData();
                    obj.getChildByName("bg").height = info.height + 50;
                    var mask = obj.getChildByName('Mask');
                    mask.on(cc.Node.EventType.TOUCH_START,function(){
                        cc.vv.popMgr.del_pop("roominfo");
                    });
                    obj.on(cc.Node.EventType.TOUCH_START,function(){
                        cc.vv.popMgr.del_pop("roominfo");;
                    });
                });
            }
            break;
            case "btn_yiwen":
            {
                var stt = this._desc;
                var str = cc.find("Canvas/mgr/hud/oper/btn_yiwen/bg_menu/label");
                str.getComponent(cc.Label).string = "";
                var menu =cc.find("Canvas/mgr/hud/oper/btn_yiwen/bg_menu");
                if( str.active === false)
                {
                  str.active = true;
                  menu.active  = true;

                  for (var i = 0; i < stt.length; ++i)
                  {
                      if(stt[i] == " ")
                      {
                        str.getComponent(cc.Label).string += "\n";
                      }
                      else
                      {
                         str.getComponent(cc.Label).string += stt[i];
                      }
                  }
                  menu.width = str.width;
                  menu.height = str.height + 30;
                  this.scheduleOnce(function() {
                     // 这里的 this 指向 component
                  this.qingchudingshi();
                  }, 2);
                }
            }
            break;
            case 'btn_location':{
                // if(this.node._Location == null){
                //     cc.vv.popMgr.open('table/Location',function(obj){
                //         self.node._Location = obj;
                //         self.node._Location.getComponent('Location').show(true);
                //         self.node._Location.active = true;
                //     })
                // }else{
                    this.node._Location.getComponent('Location').show(true);
                    this.node._Location.active = true;
                // }
            }  
            break;
            case 'btn_restart':{
                cc.vv.net2.quick("sync");
            }
            break;
        }
    },

    qingchudingshi:function(event,data)
    {
        var str = cc.find("Canvas/mgr/hud/oper/btn_yiwen/bg_menu/label");
        var menu =cc.find("Canvas/mgr/hud/oper/btn_yiwen/bg_menu");
        str.active = false;
        menu.active = false;
    }
});
