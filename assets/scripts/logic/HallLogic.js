cc.Class({
    extends: cc.Component,
    properties: {
        lblRuningTip:cc.Label,
        myInfo:cc.Node,
        winCreate:cc.Node,
        winOpened:cc.Node,
        winClubList:cc.Node,
        btnCreate:cc.Node,
        btnJoin:cc.Node,
        msgNotice:cc.Label,
        _winHistory:cc.Node,
        _winMessage:cc.Node,
        _notic_2:null,
        _isbtn:false,
        _btntime:-1,
        handlers: {
            default: {},
        },
    },

    removeHandler:function(event){
        if(this.handlers == null){
            this.handlers = {};
        }
        if(this.handlers[event]){
            delete this.handlers[event]
        }
    },

    addHandler:function(event,fn){
        if(this.handlers == null){
            this.handlers = {};
        }
        if(this.handlers[event]){
            return;
        }
        var handler = function(data){
            fn(data);
        };
        this.handlers[event] = handler;
    },
   
    onLoad:function(){
        cc.vv.game = null;
        cc.vv.hall = this;
        cc.vv.memberBack = true; // 如果是成员列表返回就不需要动画
        cc.vv.isLoginScene = false;
        cc.vv.hall.move_in = false;
        this.initEventHandlers();
        //审核隐藏
        if(cc.APP_STORE_REVIEW == 1 && cc.vv.userMgr.ios_review == 1  && cc.sys.os == cc.sys.OS_IOS){
            cc.find("Canvas/tools/footer/icon_down/btn_opened").active = false;
            this.winClubList.active = false;
        }else{
            this.winClubList.active = true;
        }
        this.winClubList.active = false;
        //开房记录隐藏
        this.btn_opened = cc.find("Canvas/tools/footer/icon_down/btn_opened");
        this.btn_opened.active = false;

        this.msgType = 0;
        cc.vv.net1.quick("message_list");
        cc.vv.net1.quick("share_config");
        // cc.find('Canvas/club/dailibg').active = cc.vv.userMgr.clublist == '{}';
    },

    start () {
        // this.lblVersion.string = cc.VERSION;
        this.hallEnter(0);
        this.initView();
        this.initbtn();
        //this.loopAnmation();
        // this.playFisrtWelcome();
        // setTimeout(() => {
        //     cc.director.preloadScene("tdh_1600");
        // }, 1000);
    },
    initbtn:function(){
        var self = this;
        this.cur_scene = "main";
        this.tools = this.node.getChildByName("tools");
        var footer = this.tools.getChildByName("footer");
        this.left_icon = footer.getChildByName("left_icon");
        this.icon_down = footer.getChildByName("icon_down");
        this.open = this.node.getChildByName("open");
        this.btns = this.tools.getChildByName("head").getChildByName("btns");
        this.title_btns = this.tools.getChildByName("head").getChildByName("title_btns");
        this.middle = this.node.getChildByName("tools").getChildByName("middle")
        // var bisaichang = this.middle.getChildByName("bisaichang");
        // var wodeleyuan = this.middle.getChildByName("wodeleyuan");
        // var jiarufjian = this.middle.getChildByName("jiarufjian");
        // var chuangjianfangjian = this.middle.getChildByName("chuangjianfangjian");
        // var group_btn_join = this.middle.getChildByName("group_btn_join");
        // var group_btn_create = this.middle.getChildByName("group_btn_create");
        // bisaichang.getChildByName("bsai").on(cc.Node.EventType.TOUCH_START,function(data){
        //     cc.vv.utils.light_action(bisaichang.getChildByName("light"));
        // });
        // wodeleyuan.getChildByName("wodeleyuan").on(cc.Node.EventType.TOUCH_START,function(data){
        //     cc.vv.utils.light_action(wodeleyuan.getChildByName("light"));
        // });
        // jiarufjian.getChildByName("btn_join").on(cc.Node.EventType.TOUCH_START,function(data){
        //     cc.vv.utils.light_action(jiarufjian.getChildByName("light"));
        // });
        // chuangjianfangjian.getChildByName("btn_create").on(cc.Node.EventType.TOUCH_START,function(data){
        //     cc.vv.utils.light_action(chuangjianfangjian.getChildByName("light"));
        // });
        // group_btn_join.on(cc.Node.EventType.TOUCH_START,function(data){
        //     cc.vv.utils.light_action(group_btn_join.getChildByName("light"));
        // });
        // group_btn_create.on(cc.Node.EventType.TOUCH_START,function(data){
        //     cc.vv.utils.light_action(group_btn_create.getChildByName("light"));
        // });
        if (cc.vv.global.lastYQroomid){
            cc.vv.userMgr.join(cc.vv.global.lastYQroomid,0,0);
            cc.vv.global.lastYQroomid = null
        }
    },
    loopAnmation:function(){
        var self = this;
        this.schedule(function() {
            self.btnCreate.getChildByName("animation").getComponent(sp.Skeleton).setAnimation(0,"idle",false);
            self.btnJoin.getChildByName("animation").getComponent(sp.Skeleton).setAnimation(0,"idle",false);
        }, 5, 10000, 5);
    },
    girl_action_switch(event){
        // var girl = this.node.getChildByName("ShuangKou");
        // var action = girl.getComponent(sp.Skeleton);
        // action.setCompleteListener(function(){
        //     if(event == null ){
        //         action.loop = true;
        //         action.animation = "idle_01";
        //     }else{
        //         if(event.target.name =="hat"){
        //             action.loop = false;
        //             action.animation = "idle_03";
        //             event = null;
        //         }else if(event.target.name =="body"){
        //             action.loop = false;
        //             action.animation = "idle_02";
        //             event = null;
        //         }else{
        //             action.loop = true;
        //             action.animation = "idle_01";
        //         }
        //     }
        
        // });
    },
    //进入大厅后发送
    hallEnter:function(flag){
        var enter = {
            method:"enter",
            data:{
                user_id:cc.vv.userMgr.userid,
                token:cc.vv.userMgr.token,
                adcode:cc.vv.global.adcode,
                is_replay:flag
            }
        };
        //第一次进游戏才发
        cc.vv.net1.send(enter);
        //播放背景音乐
        cc.vv.audioMgr.playBGM("bgMain2");
        this.checkClubRoomEnter();
        cc.vv.roomMgr.dissroom = null;
    },

    checkClubRoomEnter:function(){
        if(cc.vv.userMgr.clubRoomEnter != 0){
            cc.vv.club.clubMain.active = true;
            cc.vv.userMgr.club_id = cc.vv.userMgr.clubRoomEnter;
            cc.vv.club.clubMain.getComponent('ClubMain').removeAllClub();
            cc.vv.club.clubMain.getComponent('ClubMain').show(cc.vv.userMgr.clubRoomEnter);
        }
    },
    update_password:function(data){
        if(data.errcode < 0){
            cc.vv.popMgr.tip(data.errmsg);
        }
        if(data.errcode == 0){
            cc.sys.localStorage.setItem("is_me_password","");
            cc.vv.popMgr.tip("修改成功!");
            cc.vv.popMgr.del_open("PhoneBind");
        }
    },
    find_password:function(data){
        if(data.errcode < 0){
            cc.vv.popMgr.tip(data.errmsg);
        }
        if(data.errcode == 0){
            cc.sys.localStorage.setItem("is_me_password","");
            cc.vv.popMgr.tip("修改成功!");
            cc.vv.popMgr.del_open("PhoneBind");
        }
    },
    /**
     * 大厅监听
     */
    initEventHandlers: function() {
        //初始化事件监听器
        var self = this;
        cc.vv.gameNetMgr.dataEventHandler = this.node;

       //enter bug fix 
        this.node.on('enter',function(ret){
            if(ret.errcode == -1){
                cc.vv.popMgr.alert(ret.errmsg,function(){
                    cc.vv.net1.close();
                    cc.vv.g3Plugin.logout();
                    cc.director.loadScene("splash");
                });
                return;
            }
        })
       //验证码修改密码
        this.node.on('find_password',function(data){
            self.find_password(data);
        })
        //修改密码监听
        this.node.on('update_password',function(data){
            self.update_password(data);
        })
        //客服
        this.node.on('share_config',function(ret){
            cc.vv.popMgr.hide();
            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                return;
            }
            if(!ret.data){
                return;
            }
            cc.vv.userMgr.shareConfig = ret.data;
        })
        //改头像
        this.node.on('refer_img', function (ret) {
            cc.vv.popMgr.alert(ret.errmsg);
            var data = ret.data
            if(ret.errcode === 0){
                cc.vv.userMgr.headimg =  data.img
                self.myInfo.getComponent("ShowUserInfo").initLabels();
                var dd = cc.vv.popMgr.getNode("open","MyInfo")
                dd.getComponent("MyInfo").initLabels();
            }
        });
        //改名 
        this.node.on('up_info', function (ret) {
            // cc.vv.popMgr.alert(ret.errmsg);
            cc.vv.popMgr.tip("修改成功");
            var data = ret.data
            if(ret.errcode === 0){
                self.myInfo.getComponent("ShowUserInfo").initLabels();
            }
        });
        //属性更新
        this.node.on('hall_property', function (ret) {
            var data = ret.data;
            if(ret.errcode === 0){
                self.myInfo.getComponent("ShowUserInfo").refresh();
            }
            self.btn_opened.active = cc.vv.userMgr.daikai === 1;

            if (self.openechange != null){//刷新剩余积分
                self.openechange.getChildByName("bg").getChildByName("curscore").getComponent(cc.Label).string = cc.vv.userMgr.coins
            }
            self.node.getChildByName("tools").getChildByName("head").getChildByName("title_btns").getChildByName("btn_jifen").getChildByName("num").getComponent(cc.Label).string = cc.vv.userMgr.coins;
        });

        //开房列表
        this.node.on('opened_room_list',function(ret){
            cc.log('ret = ', ret);
            self.winOpened.emit("opened_room_list",ret.data.list);
        });

        //意见反馈
        this.node.on('feedback',function(ret){
            if(ret.errcode == 0){
                cc.vv.popMgr.tip("发送成功，谢谢您的宝贵的建议及意见！");
                cc.vv.popMgr.del_open("Feedback");
            }     
            else
                cc.vv.popMgr.tip("错误id："+ret.errcode+"，错误信息"+ret.errmsg);
        });
        //房间信息改变
        this.node.on('opened_room_change',function(ret){
            self.winOpened.emit("opened_room_change",ret.data);
        });

        //房间删除
        this.node.on('opened_room_remove',function(ret){
            self.winOpened.emit("opened_room_remove",ret);
        });

        //版本更新
        this.node.on('version',function(ret){
            cc.vv.popMgr.hide();
            cc.vv.popMgr.hide_loading_tip();
            cc.vv.popMgr.alert(ret.errmsg,function(){
                cc.game.restart();
            });
        });

        //错误提示
        this.node.on('updating',function(ret){
            
            cc.vv.popMgr.hide();
            cc.vv.popMgr.hide_loading_tip();
            cc.vv.popMgr.alert(ret.errmsg);
        });

        //创建房间
        this.node.on('create', function (ret) {
            //滚动公告
            if(ret.errcode !== 0){
                cc.vv.popMgr.alert(ret.errmsg);
                cc.vv.popMgr.hide_loading_tip();
                return;
            }
            if(ret.data.clubid != 0){
                cc.vv.userMgr.clubRoomEnter = ret.data.clubid;
            }
            //代开房
            if(ret.data.type == 2){
                cc.vv.popMgr.hide_loading_tip();
                cc.vv.popMgr.alert("房间[" + ret.data.room_id +"]创建成功\r\n\r\n快去邀请好友一起来玩吧!" ,function(){
                    cc.vv.popMgr.open("Share",function(obj){
                        obj.getComponent("Share").onhideshare(1);
                        obj.getComponent("Share").share(self.createroom_share,self,ret.data);
                    },ret); 
                },true);
                cc.vv.popMgr.hide();
                return;
            }
        });
    
        //加入房间
        this.node.on('init', function (ret) {

            //大厅里面收到init，说明是掉线重连的，直接关闭
            cc.vv.popMgr.hide();

            //重新进入大厅
            self.hallEnter(1);
        });

        //公告
        this.node.on('notic', function (ret) {
            var data = ret.data;
            if(ret.errcode !== 0){
                cc.vv.popMgr.alert(ret.errmsg);
                cc.vv.popMgr.hide();
                return;
            }
            cc.vv.userMgr.notic = data;
            //刷新显示
            self.initNotic();
        });

        //加入房间
        this.node.on('join', function (ret) {
            var data = ret.data;
            
            //滚动公告
            if(ret.errcode !== 0){
                cc.vv.popMgr.hide_loading_tip();
                
                if(ret.errcode == -2){
                    if(data.club_id != 0){
                        cc.vv.popMgr.alert(ret.errmsg,function(){
                            cc.vv.club.clubMain.emit('club_room_del',{data:{roomid:data.room_id,clubid:data.club_id}});
                            var get = {
                                method:"club_room_list",
                                data:{
                                    club_id:data.club_id
                                }
                            };
                            cc.vv.net1.send(get);
                        });
                    }else{
                        cc.vv.popMgr.alert(ret.errmsg);
                    }
                }else if(ret.errcode == -3){
                    cc.vv.popMgr.alert(ret.errmsg,function(){
                        cc.vv.userMgr.join(data.room_id,data.club_id,1);
                    },true);
                }else{
                    cc.vv.popMgr.alert(ret.errmsg);
                }
                return;
            }
        });

        //创建房间
        this.node.on('room', function (ret) {
            var data = ret.data;
            if(ret.errcode !== 0){
                return;
            }
            cc.log('ret = ', ret);
            cc.vv.roomMgr.init();
            if(data.type && data.type == "zpj_2800"){
                cc.vv.tempDataMgr.pokerNine = 0; //0为大 1为小 3扩展
            }
            if(data.type && data.type == "zpj_2801"){
                cc.vv.tempDataMgr.pokerNine = 1; //0为大 1为小 3扩展
                data.type = "zpj_2800"
            }
            cc.vv.roomMgr.room_type = data.type;
            cc.vv.roomMgr.roomid = data.roomid;
            // cc.log('6666666666666666666666');
            cc.vv.popMgr.loading_tip("join",function(obj){
                // cc.log('123222222222');
                obj.getComponent("LoadingTip").scheduleShow(14,"无法连接到服务器",function(){
                    cc.vv.popMgr.alert("无法连接上服务器，请检查网络后重试",function(node){
                      cc.game.restart();
                    });
                });
                //预加载游戏
                cc.director.preloadScene(cc.vv.roomMgr.room_type);

                var url = "ws://" + data.server + ":" + data.port;//修改成固定地址端口的  
                cc.log('url = ', url);
                // var url = "ws://www.casrsnnxm.cn:19095";
                cc.vv.gameNetMgr.connectGameServer(url);
            })
        });

        //战绩列表
        this.node.on('history', function (ret) {
            // cc.vv.popMgr.hide();
            var data = ret.data;
            if(ret.errcode !== 0){
                cc.vv.popMgr.alert(ret.errmsg);
                cc.vv.popMgr.hide();
                return;
            }
            self._winHistory.getComponent("History").history(data.list);
        });

        //兑换奖品
        this.node.on('redeem_record', function (ret) {
            var data = ret;
            if (data.errmsg != "ok"){
                cc.vv.popMgr.alert(data.errmsg);
            }else{
                cc.vv.popMgr.alert("兑换成功");
            }
        });

        //战绩列表
        this.node.on('other', function (ret) {
            if(!ret){
                return;
            }
            var key = ret.event;
            var callback = self.handlers[key];
            if(typeof(callback) == "function"){
                callback(ret);
            }
        });

        //战绩战绩分局信息
        this.node.on('history_round', function (ret) {
            cc.vv.popMgr.hide();
            var data = ret.data;
            if(ret.errcode !== 0){
                cc.vv.popMgr.alert(ret.errmsg);
                return;
            }
            cc.vv.popMgr.open("hall/History",function(obj){
                obj.getComponent("History").round(data);
            })
        });

        //战绩战绩分局信息
        this.node.on('history_replay', function (ret) {
            var data = ret.data;
            if(ret.errcode !== 0){
                cc.vv.popMgr.hide();
                cc.vv.popMgr.alert(ret.errmsg);
                return;
            }
            cc.vv.popMgr.loading_tip("join");
            cc.vv.roomMgr.enter = data.enter;
            cc.vv.roomMgr.table = data.table;
            cc.vv.roomMgr.param = data.param;
            cc.vv.roomMgr.action = data.action;
            cc.vv.roomMgr.jiesuan = data.jiesuan;
            cc.vv.roomMgr.roomid = data.enter.room_id;
            cc.vv.roomMgr.ren = data.enter.ren;
            cc.vv.roomMgr.now = data.enter.round;
            cc.vv.roomMgr.max = data.enter.max_round;
            cc.vv.roomMgr.room_type = data.param.model;
            //是否在回放
            cc.vv.roomMgr.is_replay = true;
            if(cc.vv.club.roomPool != null){
                cc.vv.club.roomPool.clear();
            }
            cc.director.loadScene(cc.vv.roomMgr.room_type);
        });

        //消息列表
        this.node.on('message_list', function (ret) {
            var data = ret.data;
            if(ret.errcode !== 0){
                cc.vv.popMgr.hide();
                cc.vv.popMgr.alert(ret.errmsg);
                return;
            }
            if(cc.vv.hall.msgType == 1){
                self._winMessage.getComponent("Message").message(data.messageList);
            }
            else{
                self.msgNotice.node.parent.active = false;
                self.msgNotice.string = 0;
                var num = 0;
                for(var i = 0; i < data.messageList.length; ++i){
                    var status = data.messageList[i].status;
                    if(status == 0){
                        num++;
                        self.msgNotice.node.parent.active = true;
                        self.msgNotice.string = num;
                    }
                }
                if(num == 0){
                    self.msgNotice.node.parent.active = false;
                }
            }
            
        });

        this.node.on('message_add', function (ret) {
            var data = ret.data;
            if(ret.errcode !== 0){
                cc.vv.popMgr.hide();
                cc.vv.popMgr.alert(ret.errmsg);
                return;
            }
        });
        //新增消息
        // cc.vv.hall.addHandler("message_add",mobile_code);
        // cc.vv.net1.quick("message_add",
        //     {
        //         club_id:575617786,
        //         userid:889169,
        //         title:"恭喜",
        //         desc:"中奖了，赶紧来领",
        //         content:"你最近非常活跃，系统决定赠送你不少钻石，继续保持",
        //         att_ticket:234
        //    });
        this.node.on('opened_room_history', function (ret) {
            var data = ret.data;
            if(ret.errcode !== 0){
                cc.vv.popMgr.hide();
                cc.vv.popMgr.alert(ret.errmsg);
                return;
            }
            self.winOpened.emit("opened_room_history",data.list);
        });
    },

    initView:function(){
        //刷新属性
        this.myInfo.getComponent("ShowUserInfo").refresh();
        //初始化公告
        this.initNotic();
        if(cc.sys.localStorage.getItem("cuopaiset") == "true"){
            cc.vv.userMgr.is_cuopai = true;
        }else{
            cc.vv.userMgr.is_cuopai = false;
        }
        if(cc.sys.localStorage.getItem("shakeset") == "false"){
            cc.vv.userMgr.is_shake = false;
        }else{
            cc.vv.userMgr.is_shake = true;
        }
        cc.vv.userMgr.is_singletouch = cc.sys.localStorage.getItem("singletouchset") == "true" ? true : false;
    },

    //初始化公告
    initNotic:function(){
        var self = this;
        var data = cc.vv.userMgr.notic;
        if(data == null)return;
        //滚动公告
        self.lblRuningTip.string = data.notic_1;
        self._notic_2 = data.notic_2;
        if(data.notic_3 && data.notic_3 !== "" && cc.vv.hall_pop_notice === 1){
                cc.vv.popMgr.pop('hall/MessageContent',function(obj){
                    obj.getComponent('MessageContent').notic(data.notic_3);
                });
        }
        if(cc.vv.is_show_notic1){}else{
            cc.vv.is_show_notic1 = true
            this.node.getChildByName("pop").getChildByName("aly").active = true;
        }
        cc.vv.hall_pop_notice = null;
    },

    //播放欢迎语
    playFisrtWelcome:function(){
        if(cc.vv.userMgr.playFisrtWelcome != 1)return;
        cc.vv.userMgr.playFisrtWelcome = 0;
        var sex = cc.vv.userMgr.sex;
        switch(sex){
            case 1:
            case '1':{
                sex = 2;
            }
            break;
            case 2:
            case '2':{
                sex = 1;
            }
            default:{
                sex = 2;
            }
            break;
        }
        
        var mp3File = "game_start_" + sex;
        cc.vv.audioMgr.playSFX(mp3File);
    },

    //根据选择分享不同内容
    share:function(type){
        var platform = parseInt(type);
        var url = cc.GAMEADRESS;
        if(!cc.vv.userMgr.shareConfig){
            return;
        }
        // var httpImgUrl = 'http://www.ruichengchayuan.com:8088/rcheng.jpg';
        var httpImgUrl = cc.vv.userMgr.shareConfig.share_url;
        // var imgurls = jsb.fileUtils.fullPathForFilename('res/raw-assets/resources/public/dairy_share.jpg');
        cc.vv.utils.loadUrlImg(httpImgUrl,function(img){
           let imgurl = img || ""
            if (platform == 4){
                cc.vv.g3Plugin.shareXLTUrl(imgurl,url,"有人@你玩游戏！","你的好友正在玩游戏！玩法超多超精彩！快来打败他！")
            }else{
                cc.vv.g3Plugin.shareImg(platform,"",imgurl,"",null);
            }
        });
    },
    //根据选择分享不同内容
    createroom_share:function(type,obj,data){  
        var platform = parseInt(type);
        var title = cc.GAME_NAME + "房间号：" + data.room_id;
        var text = "玩法:" + data.desc;
        var url = cc.GAMEADRESS;
        var imgurl = jsb.fileUtils.fullPathForFilename('res/raw-assets/resources/public/dairy_icon.png');
        cc.vv.g3Plugin.shareWeb(platform,title,text,imgurl,url);
    },
    //创建房间动画
    create_action:function(type){
        var _time = 0.3;
        var _time_add = 0;
        var ShuangKou = this.node.getChildByName("ShuangKou");
        if(type == "right"){//头标签向右移动
            this.title_btns.runAction(cc.sequence(//标题按钮移动动画
                cc.moveTo(_time,cc.v2(this.title_btns.x + 90,this.title_btns.y)),
                cc.callFunc(function () {   
                },this),
            ));
            this.btns.runAction(cc.sequence(//标题移动动画
                cc.moveTo(_time,cc.v2(this.btns.x,this.btns.y + 120)),
                cc.callFunc(function () {   
                },this),
            ));
            ShuangKou.runAction(cc.sequence(//女孩移动动画
                cc.moveTo(_time + _time_add,cc.v2(-600,-186)),
                cc.callFunc(function () {   
                },this),
            ));
            this.left_icon.runAction(cc.sequence(//左边icon移动动画
                cc.moveTo(_time,cc.v2(this.left_icon.x - 155,0)),
                cc.callFunc(function () {   
                },this),
            ));
            this.icon_down.runAction(cc.sequence(//下边icon移动动画
                cc.moveTo(_time + _time_add,cc.v2(0,-100)),
                cc.callFunc(function () {   
                },this),
            ));
            this.middle.runAction(cc.sequence(//右边按钮移动动画
                cc.spawn(
                    cc.fadeTo(_time + 0.1,0),
                    cc.moveTo(_time + 0.1,cc.v2(150,-15)),  
                    cc.scaleTo(_time + 0.1,0.85,0.85)
                ),
                cc.callFunc(function () {   
                },this),
            ));
        }else if(type == "left"){
            if(this.cur_scene != null && this.cur_scene == "create"){
                this.cur_scene = "main";
                var new_CreateRoom = this.open.getChildByName("new_CreateRoom");
                var more_game = this.open.getChildByName("more_game");
                if(new_CreateRoom != null){
                    var create_game_node = new_CreateRoom.getChildByName("gameNode");
                    create_game_node.runAction(cc.sequence(//屏风移动动画
                        cc.spawn(
                            cc.fadeTo(_time ,0),     
                            cc.moveTo(_time,cc.v2(create_game_node.x + 300,create_game_node.y))
                        ),
                        cc.callFunc(function () {   
                            new_CreateRoom.destroy();
                        },this),
                    ));
                }
                if(more_game != null){
                    var create_game_node = more_game.getChildByName("gameNode");
                    create_game_node.runAction(cc.sequence(//屏风移动动画
                        cc.spawn(
                            cc.fadeTo(_time ,0),     
                            cc.moveTo(_time,cc.v2(create_game_node.x + 300,create_game_node.y))
                        ),

                        cc.callFunc(function () {   
                            more_game.destroy();
                        },this),
                    ));
                }
                this.title_btns.runAction(cc.sequence(//标题按钮移动动画
                    cc.moveTo(_time,cc.v2(this.title_btns.x - 90,this.title_btns.y)),
                    cc.callFunc(function () {   
                    },this),
                ));
                this.btns.runAction(cc.sequence(//标题移动动画
                    cc.moveTo(_time,cc.v2(this.btns.x,this.btns.y - 120)),
                    cc.callFunc(function () {   
                    },this),
                )); 
                ShuangKou.runAction(cc.sequence(//女孩移动动画
                    cc.moveTo(_time + _time_add,cc.v2(-430,-186)),
                    cc.callFunc(function () {   
                    },this),
                ));
                this.left_icon.runAction(cc.sequence(//左边icon移动动画
                    cc.moveTo(_time,cc.v2(this.left_icon.x + 155,0)),
                    cc.callFunc(function () {   
                    },this),
                ));
                this.icon_down.runAction(cc.sequence(//下边icon移动动画
                    cc.moveTo(_time,cc.v2(0,26.5)),
                    cc.callFunc(function () {   
                    },this),
                ));
                this.middle.runAction(cc.sequence(//右边按钮移动动画
                    cc.spawn(
                        cc.fadeTo(_time + 0.1 ,255),
                        cc.moveTo(_time + 0.1,cc.v2(0,-15)),
                        cc.scaleTo(_time + 0.1,1,1)
                    ),
                    cc.callFunc(function () {   
                    },this),
                ));
            }
        }
    },
    /**
     * 按钮处理
     */
    onBtnClicked:function(event){
        cc.vv.audioMgr.click();
        var self = this;
        // cc.log('111');
        // cc.log('event.target.name =',event.target.name);
        switch(event.target.name){
            case "btn_phone":{//绑定手机
                cc.vv.popMgr.open("hall/PhoneBind");
            }
            break;
            case "back_main":{//返回主页
                this.create_action("left");
                cc.vv.hall.move_in = false;
            }
            break;
            case "btn_daili":{//点击主场景中的我的圈子
                cc.vv.platform.order();
            }
            break;
            case "btn_hongbao":{//点击主场景中的我的圈子
                cc.vv.popMgr.pop("hall/PlugNotic");
            }
            break;
            case "wodeleyuan":{//点击主场景中的我的圈子
                if(self._isbtn == true)return;
                self._isbtn = true;
                cc.vv.popMgr.del_pop("new_CreateRoom");
                var objKeys = Object.keys(cc.vv.userMgr.clublist);
                if(objKeys.length == 0){
                    cc.vv.popMgr.tip('您没有任何乐圈');
                    if(self._btntime = ! -1){
                        clearTimeout(self._btntime);
                        self._btntime = -1;
                    }
                    self._isbtn = false;
                    return;
                }
                cc.vv.club.clubMain.getComponent('ClubMain').removeRoomAllClub();
                cc.vv.club.clubMain.active = true;
                cc.vv.club.clubMain.getComponent('ClubMain').show(0);
            }
            break;
            case "btn_invite":{//点击主场景中的反馈
                cc.vv.popMgr.open("Share",function(obj){
                    obj.getComponent("Share").share(self.share);
                });
            }
            break;
            case "btn_ticket":{ //点击主场景中的商城，判断是否是审核模式，如果是打开商城充值页面。如果不是打开微信充值页面。
                cc.vv.platform.order();
            }
            break;
            case "img":{//点击主场景中的个人信息
                cc.vv.popMgr.open("hall/MyInfo");
            }
            break;
            case "btn_feedback":{//点击主场景中的反馈
                cc.vv.popMgr.open("hall/Feedback");
            }
            break;
            case "btn_replay":{//点击主场景中的回放
                cc.vv.popMgr.open("hall/Replay");
            }
            break;
            case "btn_exchange":{//点击主场景中的兑换
                cc.vv.popMgr.open("hall/OpenExChange", function (obj) {
                    self.openechange = obj;
                    self.openechange.getChildByName("bg").getChildByName("curscore").getComponent(cc.Label).string = cc.vv.userMgr.coins
                });
            }
            break;
            case "btn_wanfa":{
                cc.vv.popMgr.open("hall/GameHelp");
            }
            break;
            case "btn_setting":{
                cc.vv.popMgr.open("Setting");
            }
            break;
            case "btn_join" :{
                cc.vv.popMgr.open("hall/JoinRoom");
            }
            break;
            case "btn_create" :{
                cc.vv.popMgr.tip("请加入圈子创建游戏！");
                return
                if(self._isbtn == true)return;
                self._isbtn = true;
                if(cc.vv.hall.move_in) return;
                cc.vv.hall.move_in = true;
                cc.vv.club.clubMain.active = false;
                //普通创房
                cc.vv.hall.create_room = 0;

                //测试修改亲友圈规则
                // cc.vv.hall.create_room = 3;
                // cc.vv.userMgr.club_rule_index = 0;
                this.create_action("right");
                cc.vv.popMgr.open("hall/new_CreateRoom");
                this.cur_scene = "create";//当前在创建房间场景
                //this.winCreate.active = true;
                //this.winCreate.emit("show");
            }
            break;
            case "bsai" :{
                cc.vv.popMgr.tip("敬请期待");
                return;
                
                //如果版本不同，要强制下载
                if(cc.H5_GAME != 1){
                    cc.vv.popMgr.alert("已经有新版本，您必须安装新版本才可以继续游戏",function(){
                        cc.sys.openURL(cc.game_url);
                    })
                    return;
                }
                if(self._isbtn == true)return;
                self._isbtn = true;
                if(cc.vv.hall.move_in) return;
                cc.vv.hall.move_in = true;
                cc.vv.club.clubMain.active = false;
                //普通创房
                cc.vv.hall.create_room = 0;

                //测试修改亲友圈规则
                // cc.vv.hall.create_room = 3;
                // cc.vv.userMgr.club_rule_index = 0;
                this.create_action("right");
                cc.vv.popMgr.open("hall/more_game");
                this.cur_scene = "create";//当前在创建房间场景
                //this.winCreate.active = true;
                //this.winCreate.emit("show");
            }
            break;
            case "btn_opened" :{
                cc.vv.utils.popPanel(this.winOpened);
                this.winOpened.active = true;
                this.winOpened.emit("show");
            }
            break;
            case "btn_message":{
                cc.vv.popMgr.open("hall/Message",function(obj){
                    self._winMessage = obj;
                    self.msgType = 1;
                    cc.vv.net1.quick("message_list");
                })
            }
            break;
            case "btn_zhanji":{
                cc.vv.popMgr.open("hall/History",function(obj){
                    self._winHistory = obj;
                    cc.vv.popMgr.wait2('正在获取数据',function(obj){
                        cc.vv.net1.quick("history",{pay_way:1});
                    })
                })
            }
            break;
            case "btn_notic2":{
                if(self._notic_2){
                    cc.vv.popMgr.pop('hall/MessageContent',function(obj){
                        obj.getComponent('MessageContent').notic(self._notic_2);
                    });
                }else{
                    cc.vv.popMgr.tip("暂无公告内容");
                }
            }
            break;

            default:{
                cc.vv.popMgr.tip("敬请期待");
            }
        }

        if(self._btntime = ! -1){
            clearTimeout(self._btntime);
            self._btntime = -1;
        }
        self._btntime = setTimeout(() => {
            self._isbtn = false;
            self._btntime = -1;
        }, 1000);
    },
    update: function (dt) {
        if(1==1){
            return;
        }
        //this.auto_dismssroom(dt);
    },
    // update (dt) {},
    //界面关闭时
    onDestroy:function(){
        cc.loader.setAutoRelease(this, true);
    }
});