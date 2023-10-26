cc.Class({
    extends: cc.Component,

    properties: {
    
    },
    onLoad(){
        cc.vv.zuowei = this;
    },

    start () {
    },

    onBtnClick:function(event, customEventData){
        var self = this;
        var name = event.target.name;
        var fangwei =  cc.vv.mahjongMgr.getSeatidByFangxiang(name);
        switch(name){
            case "dong":{
                self.hideBtn();
                //进入房间后，即发送进入命令
                cc.vv.net2.quick("sit", {
                    room_id: cc.vv.roomMgr.roomid,
                    location:cc.vv.global.latitude + "," + cc.vv.global.longitude,
                    sit:fangwei
                });
            }
            break;
            case "xi":{
                self.hideBtn();
                //进入房间后，即发送进入命令
                cc.vv.net2.quick("sit", {
                    room_id: cc.vv.roomMgr.roomid,
                    location:cc.vv.global.latitude + "," + cc.vv.global.longitude,
                    sit:fangwei
                });
            }
            break;
            case "bei":{
                self.hideBtn();
                //进入房间后，即发送进入命令
                cc.vv.net2.quick("sit", {
                    room_id: cc.vv.roomMgr.roomid,
                    location:cc.vv.global.latitude + "," + cc.vv.global.longitude,
                    sit:fangwei
                });
            }
            break;
            case "nan":{
                self.hideBtn();
                //进入房间后，即发送进入命令
                cc.vv.net2.quick("sit", {
                    room_id: cc.vv.roomMgr.roomid,
                    location:cc.vv.global.latitude + "," + cc.vv.global.longitude,
                    sit:fangwei
                });
            }
            break;
        }
    },

    hideBtn:function(){
        this.node.getChildByName("nan").active = false;
        this.node.getChildByName("bei").active = false;
        this.node.getChildByName("xi").active = false;
        this.node.getChildByName("dong").active = false;
    },

    isActiveBtnone:function(nodeName, isActive){
        if(isActive == true){
            this.node.getChildByName(nodeName).active = true;
        }else{
            this.node.getChildByName(nodeName).active = false;
        }
    }
});
