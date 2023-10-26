cc.Class({
    extends: cc.Component,

    properties: {
        btnReady: cc.Node,
        btnBegin: cc.Node,
        btncopy: cc.Node,
    },

    start: function () {
        this.initEventHandlers();
    },

    //监听协议
    initEventHandlers: function () {

        var self = this;

        //开始游戏
        this.node.on('begin', function (ret) {
            self.btnReady.active = false;
            self.btnBegin.active = false;
            self.btncopy.active = false;
        });

        this.node.emit("begin");
    },

    show: function (status,type) {

        if(cc.vv.roomMgr.param && cc.vv.roomMgr.param.is_start_mode){
            if(cc.vv.roomMgr.now == 0){
                this.btncopy.active = true;
            }else{
                this.btncopy.active = false;
            }
            if(cc.vv.roomMgr.param.start_mode == 0 && cc.vv.roomMgr.param.fangzhu == cc.vv.userMgr.userid){
                if(cc.vv.roomMgr.now == 0){
                    this.btnBegin.active = true;
                }else{
                    this.btnBegin.active = false;
                }
                return;
            }
            if(status == 0){
                cc.vv.net2.quick("ready");
            }
            return;
        }
        //如果已经是准备状态，直接全隐藏
        if (status == 1 && cc.vv.roomMgr.now != 0) {
            this.btnReady.active = false;
            this.btnBegin.active = false;
            return;
        }else{
            if(cc.vv.roomMgr.now == 0){
                this.btnReady.active = true;
                this.btnBegin.active = true;
            }
        }

        this.btncopy.active = true;

        //如果未准备，但是已经开局，只能准备
        if (cc.vv.roomMgr.started == 1) {
            this.btnReady.active = false;
            this.btncopy.active = false;
            this.btnBegin.active = false;
        }

        //房主显示开局，普通玩家显示准备
        if(cc.vv.roomMgr.now == 0){
            if (cc.vv.roomMgr.param.fangzhu == cc.vv.userMgr.userid) {
                if (cc.vv.game.config.direct_begin) {
                    this.btnBegin.active = true;
                    this.btnReady.active = false;
                } else {
                    this.btnReady.active = status == 0;
                    this.btnBegin.active = false;
                }
            } else {
                this.btnReady.active = status == 0;
                this.btnBegin.active = false;
            }
        }
    },

    fangzhu:function(data){

        if (cc.vv.roomMgr.started == 1 || cc.vv.roomMgr.now != 0) {
            return;
        }

        if (data.seatid == cc.vv.roomMgr.seatid && cc.vv.game.config.direct_begin) {
            if(cc.vv.roomMgr.param.start_mode == 0){
                this.btnBegin.active = true;
            }
            this.btnReady.active = false;
        }
    },

    
    //根据选择分享不同内容
    share:function(type,obj){
        var cntUser = 0;
        for (var i = 0; i < cc.vv.roomMgr.table.list.length; i++) {
            if (cc.vv.roomMgr.table.list[i].userid > 0) {
                cntUser++;
            }
        }

        var platform = parseInt(type);
        var title = cc.GAME_NAME + "房间号：" + cc.vv.roomMgr.roomid;
        if(cc.vv.roomMgr.ren != cntUser){
            title = title + ' [缺' + ( cc.vv.roomMgr.ren - cntUser) + "人]";
        }

        var text = "玩法:" + cc.vv.roomMgr.enter.desc;
        var url = cc.GAMEADRESS;
        var imgurl = jsb.fileUtils.fullPathForFilename('res/raw-assets/resources/public/dairy_icon.png');
        if(platform==4){
            //闲聊的邀请分享 
            cc.vv.g3Plugin.shareXLTYaoqing(imgurl,cc.vv.roomMgr.roomid+"",title,url,title,text);
        }else{
            cc.vv.g3Plugin.shareWeb(platform,title,text,imgurl,url);
        }
        
    },

    onBtnClicked: function (event, data) {
        cc.vv.audioMgr.click();
        var self = this;
        switch (event.target.name) {
            case "btn_copy":{
                cc.vv.popMgr.open("Share",function(obj){
                    obj.getComponent("Share").share(self.share,self);
                });
            }
            break;
            case "btn_ready":
                {
                    cc.vv.net2.quick("ready");
                }
                break;
            case "btn_begin":
                {
                    cc.vv.net2.quick("begin");
                }
                break;
        }
    },
});