cc.Class({
    extends: cc.Component,

    properties: {
      game:cc.Label,
      info:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var self = this;
        this.node.on('new',function(ret){
            var data = ret;
            self.game.string = data.info.split(' ')[0];
            self.info.string = data.info;

        });
    },

    onBtnClicked:function(event){
        cc.vv.audioMgr.click();
        var club_room_create = {
            method:"club_room_create",
            data:{
                version:cc.SERVER,
                club_id:cc.vv.userMgr.club_id,
                model:3,
                id:this.node.id
            }
        };
        cc.vv.popMgr.wait("正在创建房间",function(){
            cc.vv.net1.send(club_room_create);
        });
    }



    // update (dt) {},
});
