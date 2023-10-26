cc.Class({
    extends: cc.Component,

    properties: {
        login_type:0,
        debug_editbox: cc.EditBox,
        _isHasBigUpdate: false,
    },

    show:function(){
        var self = this;
        this.node.active = true; 
        //协议监听
        this.initEventHandlers();
        //连接服务器
        let callback = function() {
            setTimeout(() => {
                if(cc.sys.localStorage.getItem("auto_login") == "vx"){
                    self.onBtnWeichatClicked();
                }else if(cc.sys.localStorage.getItem("auto_login") == "yk"){
                    if (cc.GAME_RUNING_ENVIRONMENT != cc.ENVIRONMENT.debug) {
                        self.onBtnQuickStartClicked();
                    }
                }
            }, 200);
        }
        cc.vv.gameNetMgr.connectHallServer(callback);
        //预加载大厅
        cc.director.preloadScene('hall');
    },

    initUI(){
        // this.node.getChildByName("debug").active = false;
        if (!cc.sys.isNative) {
            this.node.getChildByName("btnYK").active = true;  
            if (cc.GAME_RUNING_ENVIRONMENT == cc.ENVIRONMENT.debug) {
                this.node.getChildByName("debug").active = true;
                let desc = cc.sys.localStorage.getItem("account");
                this.debug_editbox.string = desc ? desc : "";
            }
        }else if(cc.APP_STORE_REVIEW == 1 && cc.vv.userMgr.ios_review == 1  && cc.sys.os == cc.sys.OS_IOS){
            this.node.getChildByName("btnYK").active = true;  
        }else if(cc.sys.isNative  && cc.sys.os == cc.sys.OS_WINDOWS){
            this.node.getChildByName("btnYK").active = true;  
        }else{
            this.node.getChildByName("btnWexin").active = true;  
            this.node.getChildByName("btnPhone").active = true;  
        }
        this.node.getChildByName("checkout").active = true;
    },

    //版本错误时更新游戏
    onBtnDownloadClicked:function(){
        cc.sys.openURL(cc.vv.SI.game_url);
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
            cc.vv.popMgr.tip("修改成功!");
            cc.sys.localStorage.setItem("is_me_password","");
            cc.vv.popMgr.del_open("PhoneBind");
        }
    },
    mobile_code:function(data){
        cc.vv.popMgr.tip(data.errmsg);
    },

    checkIsBigUpdate(){
        if(this._isHasBigUpdate){
            cc.vv.popMgr.alert("已经有新版本，您必须安装新版本才可以继续游戏",function(){
                cc.sys.openURL(cc.game_url);
            })
        }

        return this._isHasBigUpdate;
    },
    /**
     * 协议监听
     */
    initEventHandlers: function() {

        cc.vv.gameNetMgr.dataEventHandler = this.node;

        var self = this;
        
        //验证消息提示
        this.node.on('mobile_code',function(data){
            self.mobile_code(data);
        })
        //验证码修改密码
        this.node.on('find_password',function(data){
            self.find_password(data);
        })
        //修改密码监听
        this.node.on('update_password',function(data){
            self.update_password(data);
        })
   
        //登录成功
        this.node.on('init', function (ret) {
            
            var data = ret.data;
            var version = data.android_version;

            //是否IOS在审核状态
            cc.vv.userMgr.ios_review = data.ios_review;

            //版本检查
            if(cc.sys.os == cc.sys.OS_IOS && data.ios_version){
                version = data.ios_version;
            }

            cc.vv.popMgr.hide();

            cc.game_url = data.game_url;

            //如果版本不同，要强制下载
            self._isHasBigUpdate = version != cc.PUBLISH;
            // self.checkIsBigUpdate();
            self.initUI();
        });

        //亲友圈列表
        // this.node.on('club_list', function (ret) {

        //     var data = ret.data;

        //     if(ret.errcode !== 0){
        //         cc.vv.popMgr.alert(ret.errmsg);
        //         cc.vv.popMgr.hide();
        //         return;
        //     }
        //     //缓存亲友圈信息
        //     cc.vv.userMgr.clublist = {}
            
        //     for(var i=0;i<data.list.length;++i){
        //         cc.vv.userMgr.clublist[data.list[i].club_id] = data.list[i];
        //         if(i == 0){
        //             //cc.vv.userMgr.club_id = data.list[i].club_id;
        //         }
        //     }
        // });
        this.node.on("register_code",function(ret){
            if(ret.errcode !== 0){
                cc.vv.popMgr.hide();
                cc.vv.popMgr.alert(ret.errmsg);
                return;
            }
        }),
        this.node.on("blogin_find_password",function(ret){
            if(ret.errcode !== 0){
                cc.vv.popMgr.hide();
                cc.vv.popMgr.alert(ret.errmsg);
                return;
            }else{
                cc.vv.popMgr.hide();
                cc.vv.popMgr.tip("密码找回成功，请重新登录！");
                var dd = cc.vv.popMgr.getNode("open","PhoneLogin")
                dd.getComponent("PhoneLogin").on_chenge_ok();
            }
        }),
        this.node.on("register",function(ret){
            if(ret.errcode !== 0){
                cc.vv.popMgr.hide();
                cc.vv.popMgr.alert(ret.errmsg);
                return;
            }else{
                cc.vv.popMgr.tip("账号注册成功！");
                var dd = cc.vv.popMgr.getNode("open","PhoneLogin")
                dd.getComponent("PhoneLogin").on_regist_ok();
            }
        }),
        //登录成功
        this.node.on('login', function (ret) {
            
            var data = ret.data;

            if(ret.errcode !== 0){
                cc.vv.popMgr.hide();
                cc.vv.popMgr.alert(ret.errmsg);
                return;
            }
            
            //保留玩家信息
            cc.vv.userMgr.account = data.account
            cc.vv.userMgr.userid = data.user_id;
            //cc.vv.userMgr.userName = data.name;
            cc.vv.userMgr.userName = cc.vv.utils.isEmojiCharacter(data.name) ? cc.vv.utils.checkUserName(data.name) : data.name;
            cc.vv.userMgr.gems = data.gems;
            cc.vv.userMgr.headimg = data.headimg;
            cc.vv.userMgr.adcode = data.adcode;
            cc.vv.userMgr.sex = data.sex;
            cc.vv.userMgr.ip = data.ip;
            cc.vv.userMgr.token = data.token;
            cc.vv.userMgr.is_dealer = data.is_dealer;

            if(data.status != '1'){
                cc.vv.popMgr.alert("您无法进行游戏",function(){
                    cc.game.end();
                });
                return;
            }

            //游戏重开的，要弹公告
            cc.vv.hall_pop_notice = 1;
            
            cc.director.loadScene("hall");
        });
    },

    //开始登录操作
    startLogin:function(type){
        //如果版本不同，要强制下载
        // if (this.checkIsBigUpdate()) return;

        cc.vv.audioMgr.click();

        this.login_type = type;

        var self = this;
        if(self.login_type == 0){
            cc.vv.popMgr.wait("正在游客登录",function(){
                // cc.vv.userMgr.login(btoa(encodeURI(dd)));
                cc.vv.userMgr.guest();
            });
        }else if(self.login_type == 1){
            // cc.log("self.login_type = ", self.login_type);
            cc.vv.popMgr.wait("正在微信登录",function(){
                cc.vv.g3Plugin.login(self.login_type);
            });
        }
    },
    start(){
    },
    //自定义账号登录
    onBtnDebugClicked: function(){
        let debugNode = this.node.getChildByName("debug");
        let idStr = debugNode.getChildByName("editbox").getComponent(cc.EditBox).string;
        if (idStr) {
            cc.args["account"] = idStr;
            this.startLogin(0);
        }
    },

    //游客登录
    onBtnQuickStartClicked:function(){
        if(this.node.getChildByName("checkout").getComponent(cc.Toggle).isChecked == true){
            cc.sys.localStorage.setItem("auto_login","yk");
            this.startLogin(0);
        }else{
            cc.vv.popMgr.tip("请勾选用户协议");
        }
    },
    
    //微信登录
    onBtnWeichatClicked:function(){
        if(!cc.isValid(this.node)){
            return;
        }
        if(this.node.getChildByName("checkout").getComponent(cc.Toggle).isChecked == true){
            cc.sys.localStorage.setItem("auto_login","vx");
            this.startLogin(1);
        }else{
            cc.vv.popMgr.tip("请勾选用户协议");
        }
        
    },
    btnPhone_login:function(){
        cc.vv.popMgr.open("hall/PhoneLogin");
    },

    btnRepair_login:function(){
        cc.vv.popMgr.alert("此功能将重置游戏为初始状态，是否继续？",function(){
            var storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote-asset/');
            var ret=jsb.fileUtils.removeDirectory(storagePath );
            if(ret){
                cc.vv.popMgr.alert("修复成功，请点击确定重新打开游戏",function(){
                    cc.vv.net1.close();
                    cc.vv.g3Plugin.logout();
                    cc.director.loadScene("splash");
                });
            }else{
                cc.vv.popMgr.alert("修复失败，请重试或者直接下载最新版本，谢谢~",function(){
                });
            }
        },true);

    },
});
