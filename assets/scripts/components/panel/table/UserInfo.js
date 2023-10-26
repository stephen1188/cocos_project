cc.Class({
    extends: cc.Component,

    properties: {
        _userid:null,
        _seatid:null,
    },

    
    show:function(viewid) {
        var seatid = cc.vv.roomMgr.realChairID(viewid);
        var data = cc.vv.roomMgr.table.list[seatid];
        this._userid = data.userid;
        if(this._userid == 0) {
            this.node.destroy();
            return;
        }
        this._seatid = seatid
        
        //用户名，ID
        this.node.getChildByName("username").getComponent(cc.Label).string = cc.vv.utils.cutString(data.nickname,6);
        this.node.getChildByName("userid").getComponent(cc.Label).string = "ID:" + data.userid;
        this.node.getChildByName("ip").getComponent(cc.Label).string = "IP:" + data.ip;
        //this.node.getChildByName("address").getComponent(cc.Label).string = data.address;
        this.node.getChildByName("address").getComponent(cc.Label).string = "";
        if(cc.vv.roomMgr.started == 0 && cc.vv.roomMgr.param.creator && cc.vv.roomMgr.param.creator == cc.vv.userMgr.userid){
            this.node.getChildByName("tiren").active = true;
            if(data.userid == cc.vv.roomMgr.param.creator){
                this.node.getChildByName("tiren").active = false;
            }
        }else{
            this.node.getChildByName("tiren").active = false;
        }
        if (data.userid == "0")
        {//如果玩家还没有进入房间就关掉对象信息
            this.node.destroy();
        }
        //加载头像
        this.node.getChildByName("head").getChildByName("img").getComponent("ImageLoader").loadImg(data.headimg);
    },
    
    //点击互动
    onclickinteract:function(event,customEventData)
    {
        if(cc.vv.userMgr.userid == this._userid){
            cc.vv.popMgr.tip('不能送给自己哦~~');
            return;
        }   

        if(cc.vv.game.config.is_chat != null && cc.vv.game.config.is_chat == false){
            cc.vv.popMgr.tip("本游戏禁止发送表情和互动");
            return;
        }
        //互动频率限制
        if(cc.vv.userMgr.interactTime != undefined){
            var timestamp=new Date().getTime();
            if(timestamp - 5000 < cc.vv.userMgr.interactTime){
                cc.vv.popMgr.tip('您发的太快了，歇一下吧~~');
                return;
            }
        }

        cc.vv.userMgr.interactTime = new Date().getTime();

        this.node.active=false;
        cc.vv.net2.quick("interact",{receiverId:this._userid,phizId:customEventData,bySeatID:this._seatid});
    },
    //点击震动
    onclicklisten:function(event)
    {
        var self=this;
        switch(event.target.name){
            case "Shake" :{
                if(cc.vv.userMgr.userid == this._userid){
                    cc.vv.popMgr.tip('请选择其他玩家~~');
                    return;
                }   
        
                //互动频率限制
                if(cc.vv.userMgr.shake != undefined){
                    var timestamp=new Date().getTime();
                    if(timestamp - 10000 < cc.vv.userMgr.shake){
                        cc.vv.popMgr.tip('您发的太快了，歇一下吧~~');
                        return;
                    }
                }
                cc.vv.userMgr.shake = new Date().getTime();
                var enter = {
                    method:"shake",
                    data:{
                        user_id:this._userid
                    }
                };
                cc.vv.net2.send(enter);
            }
            break;
            case "tiren" :{
                cc.vv.popMgr.alert("你确定移除这个玩家吗?",function(){
                    cc.vv.net2.quick("out",{roomid:cc.vv.roomMgr.roomid,userid:self._userid});
                    self.node.destroy();
                },true);
            }
            break;
        }
     
    },

});
