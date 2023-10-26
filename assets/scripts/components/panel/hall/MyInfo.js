cc.Class({
    extends: cc.Component,

    properties: {
    },
    
    onLoad:function(){
        //隐藏审核
        if(cc.APP_STORE_REVIEW == 1 && cc.vv.userMgr.ios_review == 1  && cc.sys.os == cc.sys.OS_IOS){
            this.node.getChildByName("btnPhoneBind").active = false;
            this.node.getChildByName("btnRealName").active = false;
            this.node.getChildByName("btnDealer").active = false;
        }
        this.is_changing = false
        this.initLabels();
    },

    /**
     * 刷新大厅显示
     */
    initLabels:function(){

        //用户名，ID
        this.node.getChildByName("username").getComponent(cc.Label).string = cc.vv.userMgr.userName;
        this.node.getChildByName("nickname").getComponent(cc.EditBox).string = cc.vv.userMgr.userName;
    
        this.node.getChildByName("userid").getComponent(cc.Label).string = "ID:" + cc.vv.userMgr.userid;
        this.node.getChildByName("ip").getComponent(cc.Label).string = "IP:" + cc.vv.userMgr.ip;
        this.node.getChildByName("address").getComponent(cc.Label).string = cc.vv.global.address;
    
        //加载头像
        this.node.getChildByName("head").getChildByName("img").getComponent("ImageLoader").loadImg(cc.vv.userMgr.headimg);

        //刷新动态的
        this.refreshLabels();

        this.node.getChildByName('btnDealer').active = cc.vv.userMgr.is_dealer==1;
        if(this.is_changing){
            let nick = this.node.getChildByName("nickname").getComponent(cc.EditBox).string
            cc.vv.net1.quick("up_info",{headImg:cc.vv.userMgr.headimg,name:nick});
        }
    },

    refreshLabels:function(){
        this.node.getChildByName("btn_ticket").getChildByName("num").getComponent(cc.Label).string = cc.vv.userMgr.ticket;
        this.node.getChildByName("scroe").getComponent(cc.Label).string = "积分:"+ cc.vv.userMgr.coins;
    },
    on_nicname_changed(e,v){
        let nick = this.node.getChildByName("nickname").getComponent(cc.EditBox).string
        if(nick==cc.vv.userMgr.userName){
            return
        }
        // var up_info = function(ret){
        //     var data = ret.data;
        //     if(ret.errcode !== 0){
        //         cc.vv.popMgr.alert(ret.errmsg);
        //         self.node.getChildByName("nickname").getComponent(cc.EditBox).string = cc.vv.userMgr.userName
        //         return;
        //     }
        //     cc.vv.userMgr.userName = self.node.getChildByName("nickname").getComponent(cc.EditBox).string
        //     cc.vv.popMgr.alert(ret.errmsg);
        //     cc.vv.hall.removeHandler('up_info');
        // };
        // cc.vv.hall.addHandler("up_info",up_info);
        cc.vv.userMgr.userName = nick
        cc.vv.net1.quick("up_info",{headImg:cc.vv.userMgr.headimg,name:nick});
    },
    on_btn_changeImg(e,v){
        // var self = this
        // var refer_img = function(ret){
        //     var data = ret.data;
        //     if(ret.errcode !== 0){
        //         cc.vv.popMgr.alert(ret.errmsg);
        //         return;
        //     }
        //     cc.vv.userMgr.headimg =  data.img
        //     self.node.getChildByName("head").getChildByName("img").getComponent("ImageLoader").loadImg(cc.vv.userMgr.headimg);
        //     cc.vv.popMgr.alert(ret.errmsg);
        //     cc.vv.hall.removeHandler('refer_img');
        // };
        // cc.vv.hall.addHandler("refer_img",refer_img);
        this.is_changing = true
        cc.vv.net1.quick("refer_img",{});
    },
    
    /**
     * 按钮处理
     */
    onBtnClicked:function(event){

        cc.vv.audioMgr.click();
        var self = this;

        switch(event.target.name){
            case "btn_ticket":{
                cc.vv.platform.order();
            }
            break;
            case "btnRealName":{
                cc.vv.popMgr.open("hall/RealName");
            }
            break;
            case "btnPhoneBind":{
                cc.vv.popMgr.open("hall/PhoneBind");
            }
            break;
            case "btnDealer":{
                cc.sys.openURL(cc.GAMEDEALER);
            }
            break;
        }
    },
    onDestroy:function(){
        cc.vv.hall.removeHandler('real_name');
    }
});
