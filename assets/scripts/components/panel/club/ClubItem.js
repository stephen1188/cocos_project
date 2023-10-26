cc.Class({
    extends: cc.Component,

    properties: {
        clubname:cc.Label,
        head:cc.Node,
        mask:cc.Node,

        _club_id:'',
        _status:0,
        _userStatus:1,
    },

    init:function(data){
        this.clubname.string = data.name;
        // var labeloutline = this.clubname.node.getComponent(cc.LabelOutline);
        // if(labeloutline.enabled){
            this.mask.width = 200;
        // }else{
        //     this.mask.width = 196;
        // }
        this.clubname.node.stopAllActions();
        if(this.clubname.node.width > 196){
            var move = (this.clubname.node.width - 196) / 2;
            this.clubname.node.runAction(
                cc.repeatForever(
                    cc.sequence(cc.delayTime(1.0),cc.moveTo(2.0,cc.v2(move,this.clubname.node.y)),cc.delayTime(1.0),cc.moveTo(2.0,cc.v2(-move,this.clubname.node.y)))
                )
            );
        }
        this._club_id = data.club_id;
        this._status = data.status;
        this._userStatus = data.userStatus;
        this.head.getComponent("ImageLoader").loadImg(data.creator_headimg);
    },

    onBtnClick:function(event){
        var self = this;
        cc.vv.audioMgr.click();
        var userStatus = cc.vv.userMgr.clublist[this.node.myTag].userStatus;
        if(userStatus != 1){
            cc.vv.popMgr.alert('你无法在该乐圈游戏');
            return;
        }
        cc.vv.userMgr.club_id = this._club_id;
        cc.vv.club.clubMain.active = true;
        //var spr = this.head.getComponent(cc.Sprite).spriteFrame;
        //cc.vv.club.clubMain.getComponent('ClubMain').show(cc.vv.userMgr.club_id,spr);
        cc.vv.popMgr.wait('',function(){
            cc.vv.club.clubMain.getComponent('ClubMain').show(cc.vv.userMgr.club_id);
            cc.vv.club.clubMain.getComponent('ClubMain').close_allclublist();
        })

        //如果亲友圈信息不存在
        // if(cc.vv.userMgr.clubRoom == null || cc.vv.userMgr.clubRoom[this._club_id] == undefined){
        //     cc.vv.net1.quick('club_room_list',{club_id:this._club_id});
        // }
    },

    // update (dt) {},
});
