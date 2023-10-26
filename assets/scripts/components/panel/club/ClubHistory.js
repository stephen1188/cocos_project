cc.Class({
    extends: cc.Component,

    properties: {
        lblRoomID:cc.Label,
        lblTime:cc.Label,
        lblDesc:cc.Label,
        lblType:cc.Label,
        players:cc.Node,
        user:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
        if(cc.winSize.width / cc.winSize.height - 16 / 9 > 0.1){ 
            var width = cc.winSize.width;
            this.node.width = width-314;
        }
        var self = this;
        this.node.on('new',function(ret){
            var data = ret;
            var list = data.table.list;
            self.lblRoomID.string = data.room_id;
            self.lblTime.string = data.created.replace(/ /g,"\n");
            self.lblDesc.string = data.desc;
            self.lblType.string = data.battle_type == 0 ? '普通场' : '排位场';
            self.showPlayer(data);
        });
    },

    showPlayer:function(data){
        //var uids = data.uids.split(',');
        var scores = data.scores.split(',');
        this.players.removeAllChildren();
        for(var i = 0; i < data.table.list.length; ++i){
            var info = data.table.list[i];
            if(info.userid <= 0){
                break;
            }
            var node = cc.instantiate(this.user);
            this.players.addChild(node);
            var name = node.getChildByName('mask').getChildByName('name');
            //name.getComponent(cc.Label).string = info.nickname;
            name.getComponent(cc.Label).string = info.nickname;
            if(name.width > 44){
                var move = (name.width - 44) / 2;
                name.runAction(
                    cc.repeatForever(
                        cc.sequence(cc.delayTime(1.0),cc.moveTo(2.0,cc.v2(move,0)),cc.delayTime(1.0),cc.moveTo(2.0,cc.v2(-move,0)))
                    )
                );
            }
            node.getChildByName('score').getComponent(cc.Label).string = scores[i];
            node.getChildByName('head').getComponent('ImageLoader').loadImg(info.headimg);
        }
    },

    onBtnClicked:function(event){
        switch(event.target.name){
            case 'btn_del':{

            }
            break;
        }
    }


    // update (dt) {},
});
