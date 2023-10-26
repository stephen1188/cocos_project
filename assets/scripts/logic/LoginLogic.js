cc.Class({
    extends: cc.Component,

    properties: {
        lblVersion:cc.Label,
        updateUI:cc.Node,
        loadingUI:cc.Node,
        loginUI:cc.Node,
    },
    // use this for initialization
    onLoad: function () {
        // cc.log('cc.sys.isMobile = ', cc.sys.isMobile);
        // cc.sys.localStorage.removeItem('auto_login');//移除微信登陆自动缓存
        if(!cc.sys.isNative && cc.sys.isMobile){
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }
        cc.vv.login = this;
    },

    start:function(){
        // this.lblVersion.string = cc.VERSION;
        this.lblVersion.string = "v1.2.2";

        this.updateUI.active = false;
        this.loadingUI.active = false;
        this.loginUI.active = false;

		// cc.vv.login.loading();
        cc.vv.login.hotUpdate();
    },

    //更新
    hotUpdate:function(){
        var self = this;
        cc.vv.popMgr.wait2("正在连接服务器",function(node){
            //如果无法在短时间内连上
            node.getComponent("WaitingConnection").scheduleShow(5,"无法连接到服务器",function(){
                cc.vv.popMgr.hide();
                cc.vv.popMgr.alert("更新检测失败，请检查网络后重试",function(node){
                    cc.vv.login.loading();
                })
            });
            self.updateUI.getComponent("HotUpdate").hotUpdate(node);
        })
    },

    //载入
    loading:function(){
        this.loadingUI.getComponent("Loading").loading();
    },

    //获取定位提示
    location:function(){
        //如果没有在大厅弹过提示
        if(cc.sys.localStorage.getItem("location_show") != 1){
            cc.vv.popMgr.hide();
            cc.vv.popMgr.alert("尊敬的用户：\r\n\r\n同意获取定位可以让您查看他人位置信息，有效防止游戏作弊！\r\n\r\n请允许获取您的当前位置",function(){
                cc.vv.g3Plugin.location();
                cc.sys.localStorage.setItem("location_show",1);
            },true);
        }else{
            cc.vv.g3Plugin.location();
        }
    },

    //登录
    login:function(){
        this.location();
        this.loginUI.getComponent("Login").show();
    },
    btn_Userprotocol:function(){
        cc.vv.popMgr.open("hall/Userprotocol");
    },
});
