cc.Class({
    extends: cc.Component,

    properties: {
        content11:cc.RichText,
        scroll11:cc.ScrollView,
        btn_lingqu:cc.Node,
        btn_yilingqu:cc.Node,
        btn_del:cc.Node,
        title:cc.Sprite,
        message_title:cc.SpriteFrame,
        notic_title:cc.SpriteFrame
    },

    onLoad(){
        this.myid=0
    },

    notic:function(content){
        this.title.spriteFrame = this.notic_title;
        this.content11.string = content;
        this.scroll11.scrollToTop(0.1);
        this.btn_del.active = false;
        this.btn_lingqu.active = false;
        this.btn_yilingqu.active = false;
    },

    message:function(data){
        this.title.spriteFrame = this.message_title;
        this.myid = data.id;
        this.content11.string = data.content;
        this.scroll11.scrollToTop(0.1);
        this.refreshBtn(data);
    },

    refreshBtn:function(data){
       
        if(data.userid == 0){
            // this.btn_lingqu.x = 0;
            // this.btn_yilingqu.x = 0;
            this.btn_del.active = false;
        }
        if(data.att_ticket != 0){
            this.btn_lingqu.active = data.status==0;
            this.btn_yilingqu.active = data.status==1;
            this.btn_del.active = data.status==1;
        }
        else{
            this.btn_lingqu.active = false;
            this.btn_yilingqu.active = false;
            // this.btn_del.x = 0;
        }
    },

    onBtnClicked:function(event){
        var self = this;
        switch(event.target.name){
            case 'btn_lingqu':{
                //领取消息（钻石）
                var func = function(ret){
                    var data = ret.data;
                    if(ret.errcode !== 0){
                        cc.vv.popMgr.hide();
                        cc.vv.popMgr.alert(ret.errmsg);
                        return;
                    }
                    cc.vv.popMgr.tip('已领取');
                    self.btn_lingqu.active = false;
                    self.btn_yilingqu.active = true;
                    self.btn_del.active = true;
                    cc.vv.hall._winMessage.getComponent("Message").refreshMsg(self.myid);
                };
                cc.vv.hall.addHandler("message_update_status",func);
                cc.vv.net1.quick("message_update_status",
                    {
                        id:self.myid
                    });
            }
            break;
            case 'btn_del':{
                //删除消息
                var message_delete = function(ret){
                    var data = ret.data;
                    if(ret.errcode !== 0){
                        cc.vv.popMgr.hide();
                        cc.vv.popMgr.alert(ret.errmsg);
                        return;
                    }
                    
                    cc.vv.hall._winMessage.getComponent("Message").removeMsg(data.id);
                    self.node.destroy();
                };
                cc.vv.hall.addHandler("message_delete",message_delete);
                cc.vv.net1.quick("message_delete",{id:self.myid});
            }
            break;

        }
    },

    onDestroy:function(){
        cc.vv.hall.removeHandler('message_update_status');
        cc.vv.hall.removeHandler('message_delete');
    }
});
