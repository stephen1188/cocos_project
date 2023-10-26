cc.Class({
    extends: cc.Component,

    properties: {
       head:cc.Node,
       user_name:cc.Label,
       club_name:cc.Label,
       content:cc.Label,
       _index:-1,
    },

    joinClub:function(data){
        this.head.getComponent("ImageLoader").loadImg(data.headimg);
        this.user_name.string = data.user_name;
        this.club_name.string = '<' + data.club_name + '>';
        this.messageid = data.messageid;
        this.type = data.type;
        this._index=1;
    },

    dealer:function(data){
        this.head.getComponent("ImageLoader").loadImg(data.headimg);
        this.user_name.string = data.user_name;
        this.club_name.string = "";
        this.messageid = data.message_id;
        this.node.getChildByName("NewLabel").getComponent(cc.Label).string="邀请您为代理！";
        this.node.getChildByName("NewLabel").x = 10;
        this.type = data.type;
        this._index=2;
    },

    friend:function(data){
        this.head.getComponent("ImageLoader").loadImg(data.headimg);
        this.user_name.string = data.user_name;
        this.club_name.string = '<' + data.club_name + '>';
        this.messageid = data.message_id;
        this.type = data.type;
        this._index=3;
        this.content.string = '邀请你成为他的好友';
        this.club_name.node.active = false;
    },

    onBtnClicked:function(event){
        var result = 0;
        switch(event.target.name){
            case 'btn_agree':{
                result = 1;
            }
            break;
            case 'btn_refuse':{

            }
            break;
        }
        if(this._index==2){
            cc.vv.net1.quick('invite_user_dealer_notice_result',{result:result,message_id:this.messageid,type:this.type});
        }else if(this._index == 1){
            cc.vv.net1.quick('user_invite_result',{result:result,message_id:this.messageid,type:this.type});
        }else if(this._index == 3){
            cc.vv.net1.quick('club_friend_user_invite_result',{result:result,message_id:this.messageid,type:this.type});
        }
       
        this.node.destroy();
    }
    
});
