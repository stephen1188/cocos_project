cc.Class({
    extends: cc.Component,

    properties: {
        textId:cc.EditBox,
        textName:cc.EditBox,
        invite_type:'club_user_invite'
    },

    OnClubJoin:function(event){
        cc.vv.audioMgr.click();
        var id = this.textId.string;
        if(id == ''){
            cc.vv.popMgr.tip("ID不能为空");
            return;
        }

        var club_id = parseFloat(id);
        if (club_id.toString() === "NaN"){
            this.textId.string = '';
            cc.vv.popMgr.tip("输入的ID非法");
            return;
        }

        //加入申请
        cc.vv.net1.quick("club_user_join",{club_id:club_id});

        this.node.destroy();
    },

    OnClubCreate:function(event){
        cc.vv.audioMgr.click();
        var name = this.textName.string;
        var check_str_name = cc.vv.utils.testBad2('' + name);

        if(name == ''){
            cc.vv.popMgr.tip("圈子名称不能为空");
            return;
        }
        if(name.match(/^[ ]+$/)){
            this.textName.string = '';
            cc.vv.popMgr.tip("圈子名称不能全为空格");
            return;
        }
        if(cc.vv.utils.isEmojiCharacter(name)){
            this.textName.string = '';
            cc.vv.popMgr.tip("圈子名称不能包含特殊字符");
            return;
        }
        if(check_str_name){
            cc.vv.popMgr.alert('您输入的内容包括了不合适的关键字');
            return;
        }
        cc.vv.popMgr.wait("正在创建乐圈",function(){
            cc.vv.net1.quick("club_add",{name:name});
        });
        
        this.node.destroy();
    },

    OnClubInvite:function(event){
        cc.vv.audioMgr.click();
        var id = this.textId.string;
        if(id == ''){
            cc.vv.popMgr.tip("ID不能为空");
            return;
        }

        if(id == cc.vv.userMgr.userid){
            cc.vv.popMgr.tip("不能邀请自己");
            return;
        }

        var player_id = parseFloat(id);
        if (player_id.toString() === "NaN"){
            cc.vv.popMgr.tip("输入的ID非法");
            return;
        }

        //邀请
        //cc.vv.net1.quick("club_user_invite",{club_id:cc.vv.userMgr.club_id,player_id:player_id});
        cc.vv.net1.quick(this.invite_type,{club_id:cc.vv.userMgr.club_id,player_id:player_id});

        this.node.destroy();
    },

    setInviteType:function(type){
        this.invite_type = type;
    },

    OnClubOut:function(event){
        cc.vv.audioMgr.click();
        var id = this.textId.string;
        if(id == ''){
            cc.vv.popMgr.tip("ID不能为空");
            return;
        }

        var player_id = parseFloat(id);
        if (player_id.toString() === "NaN"){
            cc.vv.popMgr.tip("输入的ID非法");
            return;
        }

        //转出
        cc.vv.popMgr.wait('圈子转让中',function(){
            cc.vv.net1.quick('club_creator_update',{club_id:cc.vv.userMgr.club_id,playerid:player_id});
        });
        

        this.node.destroy();
    },

    show:function(id){
        this.master_id = id;
    },

    onClubBind:function(event){
        //绑定师徒
        cc.vv.audioMgr.click();
        var id = this.textId.string;
        if(id == ''){
            cc.vv.popMgr.tip("ID不能为空");
            return;
        }

        if(id == cc.vv.userMgr.userid){
            cc.vv.popMgr.tip("不能绑定自己");
            return;
        }

        var player_id = parseFloat(id);
        if (player_id.toString() === "NaN"){
            cc.vv.popMgr.tip("输入的ID非法");
            return;
        }

        //邀请
        cc.vv.net1.quick("club_friend_user_add",{club_id:cc.vv.userMgr.club_id,player_id:player_id,master_id:this.master_id});

        this.node.destroy();
    }
});
