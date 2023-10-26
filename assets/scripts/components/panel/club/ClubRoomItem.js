var player8 = [{x:-78,y:80},{x:78,y:80},{x:180,y:40},
                {x:180,y:-40},
                {x:78,y:-90},{x:-78,y:-90},{x:-180,y:-40},
                {x:-180,y:40}];

var player10 = [{x:-100,y:80},{x:0,y:80},{x:100,y:80},
    {x:180,y:40},{x:180,y:-40},
    {x:100,y:-90},{x:0,y:-90},{x:-100,y:-90},
    {x:-180,y:-40},{x:-180,y:40}];

var player7 = [{x:-78,y:80},{x:78,y:80},{x:180,y:40},
                {x:180,y:-40},{x:0,y:-90},{x:-180,y:-40},{x:-180,y:40}];

var player6 = [{x:-78,y:80},{x:78,y:80},{x:180,y:0},
               {x:78,y:-90},{x:-78,y:-90},{x:-180,y:0}];

var player5 = [{x:-78,y:80},{x:78,y:80},{x:180,y:0},
                {x:0,y:-90},{x:-180,y:0}];

var player4 = [{x:-78,y:80},{x:78,y:80},{x:78,y:-90},{x:-78,y:-90}];

var player3 = [{x:-78,y:80},{x:78,y:80},{x:0,y:-90}];
var player2 = [{x:0,y:80},{x:0,y:-90}];


cc.Class({
    extends: cc.Component,

    properties: {
        game:cc.Label,
       lblRoomID:cc.Label,
       lblDesc:cc.Label,

       seatItem:cc.Prefab,
       seats:cc.Node,
       jushu:cc.Node,
       typeAtlas:{
           default:null,
           type:cc.SpriteAtlas
       },
       battle_type:cc.Sprite,
       roomStatus:cc.Label,
       line:cc.Label,
       seatnum:cc.Label,
       a_name:cc.Label,

       _status:0,
       _roomid:""
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var self = this;

        this.node.on('new',function(ret){
            var data = ret;
            var info = data.desc.split(' ');
            self.lblRoomID.string = "房号：" + data.roomid;
            self.seat(data.ren,data.table);
            self._roomid = data.roomid;
            //self.game.string = info[0] + '-' + data.roomid;
            self.game.string = info[0];
            self.lblDesc.string = '';
            for(var i = 1; i < info.length; ++i){
                self.lblDesc.string += info[i] + ' ';
            }
          
            self._status = data.status;

            self.jushu.active = data.now_round > 0;
            self.battle_type.spriteFrame = self.typeAtlas.getSpriteFrame('room_type' + data.battle_type);
            self.a_name.string = cc.vv.utils.cutString(data.name,20);
            self.a_name.node.stopAllActions();
            if(self.a_name.node.width > 254){
                var move = (self.a_name.node.width - 254) / 2;
                self.a_name.node.runAction(
                    cc.repeatForever(
                        cc.sequence(cc.delayTime(1.0),cc.moveTo(2.0,cc.v2(move,self.a_name.node.y)),cc.delayTime(1.0),cc.moveTo(2.0,cc.v2(-move,self.a_name.node.y)))
                    )
                );
            }
            if(data.now_round > 0){
                if(data.max_round == -1){
                    self.roomStatus.string = data.now_round + '/不限';
                }else{
                    self.roomStatus.string = data.now_round + '/' + data.max_round;
                }
            }else{
                self.roomStatus.string = '未开始';
            }
            if(data.battle_type == 0){
                self.line.node.active = false;
            }
            else{
                self.line.node.active = true;
                self.line.string = '准入：' + data.pws.line; 
            }
            var job = cc.vv.userMgr.clublist[data.clubid].job;
            self.node.getChildByName('btn_del').active = job >= 2;
        });

        // var job = cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].job;
        // this.node.getChildByName('btn_del').active = job >= 2;
    },

    seatNumber:function(number){
        this.seatnum.string = number;
    },

    seat:function(ren,table){
        var pos = null;
        switch(ren){
            case 2:{
                pos = player2;
            }
            break;
            case 3:{
                pos = player3;
            }
            break;
            case 4:{
                pos = player4;
            }
            break;
            case 5:{
                pos = player5;
            }
            break;
            case 6:{
                pos = player6;
            }
            break;
            case 7:{
                pos = player7;
            }
            case 8:{
                pos = player8;
            }
            break;
            default:{
                pos = player10;
            }
        }
        this.seats.removeAllChildren();
        
        for(var i = 0; i < ren; ++i){
            var node = cc.instantiate(this.seatItem);
            node.parent = this.seats;
            node.x = pos[i].x;
            node.y = pos[i].y;
            node.myTag = i;
        }
        for(var i = 0; i < table.length; ++i){
            var node = cc.vv.utils.getChildByTag(this.seats,table[i].seatid);
            node.emit('new',table[i]);
        }
        
    },

    seat2:function(data){
        this.node.getChildByName('btn_del').active = false;
        this.lblRoomID.string = "";
        this.a_name.string = data.name;
        this.a_name.node.stopAllActions();
        if(this.a_name.node.width > 254){
            var move = (this.a_name.node.width - 254) / 2;
            this.a_name.node.runAction(
                cc.repeatForever(
                    cc.sequence(cc.delayTime(1.0),cc.moveTo(2.0,cc.v2(move,this.a_name.node.y)),cc.delayTime(1.0),cc.moveTo(2.0,cc.v2(-move,this.a_name.node.y)))
                )
            );
        }
        this._type = data.type;
        this.roomStatus.string = '';
        this.battle_type.spriteFrame = this.typeAtlas.getSpriteFrame('room_type' + data.type);
        if(data.type == 0){
            this.line.node.active = false;
        }
        else{
            this.line.node.active = true;
            this.line.string = "准入：" + data.line;
        }
        var wanfa = data.info.split(' ');
        this.game.string = wanfa[0];
        this.lblDesc.string = '';
        for(var i = 1; i < wanfa.length; ++i){
            this.lblDesc.string += wanfa[i] + ' ';
        }
        this.a_name.string = data.name;
        var pos = null;
        var ren = data.conf.ren;
        switch(ren){
            case "2ren":{
                pos = player2;
            }
            break;
            case '3':{

            }
            case "3ren":{
                pos = player3;
            }
            break;
            case '4':
            case "4ren":{
                pos = player4;
            }
            break;
            case '5':{

            }
            case "5ren":{
                pos = player5;
            }
            break;
            case "6":{
                pos = player6;
            }
            case "6ren":{
                pos = player6;
            }
            break;
            case "8":
            case "8ren":{
                pos = player8;
            }
            break;
            case "10ren":{
                pos = player10;
            }
            break;
        }
        this.seats.removeAllChildren();
        for(var i = 0; i < pos.length; ++i){
            var node = cc.instantiate(this.seatItem);
            node.parent = this.seats;
            node.x = pos[i].x;
            node.y = pos[i].y;
        }
    },

    onBtnClicked:function(event){
        var self = this;
        cc.vv.audioMgr.click();
        switch(event.target.name){
            case 'btn_del':{
                if(this.node.roomid == 0){
                    cc.vv.popMgr.tip("该牌桌为自动创建牌桌");
                    return;
                }
                //删除房间
                if(this.jushu.active){
                    cc.vv.popMgr.alert("房间正在游戏中，您是否确认要强制解散？",function(){
                        self.sendRemove(1);
                    },true);
                }else{
                    cc.vv.popMgr.alert("是否确定要解散房间？",function(){
                        self.sendRemove(0);
                    },true);
                }
            }
            break;
            case 'btn_tip':{
                this.node.parent.getComponent(cc.Layout).enabled = false;
                cc.vv.popMgr.newPrefad(this.node.parent,"club/ClubRuleTip", function (obj){
                    obj.x = self.node.x + 60;
                    obj.y = self.node.y + 155;
                    obj.zIndex = 100;
                    var info = obj.getChildByName("bg").getChildByName('info');
                    info.getComponent(cc.Label).string = self.lblDesc.string.replace(/ /g,"\n");
                    info.getComponent(cc.Label)._forceUpdateRenderData();
                    obj.getChildByName("bg").height = info.height + 10;
                    obj.height = info.height + 10;
                    var mask = obj.getChildByName('Mask');
                    
                    mask.on(cc.Node.EventType.TOUCH_END,function(){
                        self.node.parent.getComponent(cc.Layout).enabled = true;
                        obj.destroy();
                    });
                    
                    obj.on(cc.Node.EventType.TOUCH_END,function(){
                        self.node.parent.getComponent(cc.Layout).enabled = true;
                        obj.destroy();
                    });

                    for(var i = 0; i < self.node.parent.childrenCount; i++){
                        var node = self.node.parent.children[i];
                        if(node.name == "ClubRuleTip"){
                            if(node.x != obj.x || node.y != obj.y){
                                node.removeFromParent();
                            }
                        }
                    }
                });
            }
            break;
            case "btn_room":{
                if(cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].userStatus == -1){
                    cc.vv.popMgr.alert("你无法在该乐圈游戏");
                    return;
                }
                //加入房间
                if(this.node.roomid != 0){
                    cc.vv.userMgr.join(this._roomid,cc.vv.userMgr.club_id,0);
                }
                else{
                    // var club_room_create = {
                    //     method:"club_room_create",
                    //     data:{
                    //         version:cc.SERVER,
                    //         club_id:cc.vv.userMgr.club_id,
                    //         model:this._type == 0 ? 2 : 3,
                    //         id:this.node.myTag
                    //     }
                    // };
                    // cc.vv.popMgr.wait("正在创建房间",function(){
                    //     cc.vv.net1.send(club_room_create);
                    // });
                    this.create_joinRoom(0);
                }
                cc.vv.userMgr.clubRoomEnter = cc.vv.userMgr.club_id;
            }
        }
    },

    create_joinRoom:function(type){
        cc.log('点击了创建房间！');
        var club_room_create = {
            method:"club_room_create",
            data:{
                version:cc.SERVER,
                club_id:cc.vv.userMgr.club_id,
                model:this._type == 0 ? 2 : 3,
                id:this.node.myTag,
                type:type,
                location:cc.vv.global.latitude + "," + cc.vv.global.longitude
            }
        };
        cc.vv.popMgr.wait("正在创建房间",function(){
            cc.vv.net1.send(club_room_create);
        });
    },

    sendRemove:function(force){
        var info = {
            method:"club_room_del",
            data:{
                club_id:cc.vv.userMgr.club_id,
                room_id:this._roomid,
                force:force,
            }
        };
        cc.vv.popMgr.wait('正在解散房间',function(){
            cc.vv.net1.send(info);
        });
        
    }

    // update (dt) {},
});
