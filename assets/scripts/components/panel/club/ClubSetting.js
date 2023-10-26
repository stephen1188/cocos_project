cc.Class({
    extends: cc.Component,

    properties: {
        adminList:cc.Node,
        item:cc.Prefab,
        clubAddAdm:cc.Prefab,
        historyNode: cc.Node,
        roundNode: cc.Node,
        finder:cc.EditBox,
        admsetToggle:cc.Node,
        toggls:cc.Node,
        panels:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(cc.winSize.width / cc.winSize.height - 16 / 9 > 0.1){ 
            var width = cc.winSize.width;
            this.node.width = width;
        }
        this.HistoryJs = this.historyNode.getComponent("History");
        this.HistoryRoundJs = this.roundNode.getComponent("History");
     
    },

    init:function(){
        var myjob = cc.vv.userMgr.clubUsers[cc.vv.userMgr.club_id][cc.vv.userMgr.userid].job;
        this.admsetToggle.active = myjob > 1;
        this.finder.string = ""
        var type = '';
        for(var i = 0; i < this.toggls.childrenCount; ++i){
            var node = this.toggls.children[i];
            if(node.active){
                type = node.name;
                break;
            }
        }
        if(type != ''){
            cc.vv.utils.setToggleChecked(this.toggls,type);
        }
        this.onBtnleiXingXuanZe(null,type);
    },

    show:function(){
        cc.vv.popMgr.wait("正在获取成员列表",function(){
            cc.vv.net1.quick("club_users",{club_id:cc.vv.userMgr.club_id,type:1});
        });
    },
    clear_search(){
        this.finder.string = ""
        this.history()
    },
    history:function(){
        let self = this
        if( this.finder.string == ""){
            cc.vv.popMgr.wait("正在查询历史记录",function(){
                //cc.vv.net1.quick("club_list_battle_log", {club_id:cc.vv.userMgr.club_id});
                cc.vv.net1.quick("club_history",{pay_way:1,club_id:cc.vv.userMgr.club_id});
            });
        }else{
            cc.vv.popMgr.wait("正在查询历史记录",function(){
                cc.vv.net1.quick("club_history",{pay_way:1,club_id:cc.vv.userMgr.club_id,room_id:self.finder.string*1});
            });
        }
    },

    getHistory:function(list){
        this.HistoryJs.history(list);
     
    },

    onBtnBack:function(){
        var node = this.panels.getChildByName('history');
        this.setTab(node,'history'); 
        //this.panels.getChildByName('history').getChildByName('btn_back').active = false;
        // cc.vv.popMgr.wait("正在查询历史记录",function(){
        //     //cc.vv.net1.quick("club_list_battle_log", {club_id:cc.vv.userMgr.club_id});
        //     cc.vv.net1.quick("club_history",{pay_way:1,club_id:cc.vv.userMgr.club_id});
        // });
    },

    round:function(data){
        var node = this.panels.getChildByName('history');
        this.setTab(node,'round');
        this.HistoryRoundJs.round(data);
    },

    setTab:function(node,name){
        if(node == null) return;
        for(var i = 0; i < node.childrenCount; i++){
            var child = node.children[i];
            child.active = child.name == name;
        }
    },

    onBtnleiXingXuanZe:function(event,detail){
        if(event != null){
            cc.vv.audioMgr.click();
        }
        if(detail == null)detail = event.target.name;
        for(var i = 0; i < this.panels.children.length; ++i){
            var name = this.panels.children[i].name;
            this.panels.children[i].active = (detail == name);
        }
      
        switch(detail){
            case 'history':{
                cc.vv.userMgr.clubRoomEnter = cc.vv.userMgr.club_id;
                var node = this.panels.getChildByName(detail);
                this.setTab(node,'history');
                // this.historylist.removeAllChildren();
                cc.vv.popMgr.wait("正在查询历史记录",function(){
                    cc.vv.net1.quick("club_history",{pay_way:1,club_id:cc.vv.userMgr.club_id});
                });
            }
            break;
            case 'admin':{
                this.finder.string = ""
                // this.adminList.removeAllChildren();
                // cc.vv.popMgr.wait("正在获取管理员列表",function(){
                //     cc.vv.net1.quick("club_admin_list",{club_id:cc.vv.userMgr.club_id});
                // });
                this.admSet();
            }
            break;
        }
    },

    admSet:function(){
        this.adminList.removeAllChildren();
        var list = cc.vv.userMgr.clubUsers[cc.vv.userMgr.club_id];
        for(var i in list){
            if(list[i].job === 1 || list[i].job === 2){
                var node = cc.instantiate(this.item);
                node.myTag = list[i].userid;
                node.getComponent('AdminSet').init(list[i]);
                this.adminList.addChild(node);
            }
        }
        this.addBtn_adm();
    },

    setSuperAdm:function(userid){
        for(var i = 0; i < this.adminList.childrenCount; ++i){
            var node = this.adminList.children[i];
            var toggle = node.getComponentInChildren(cc.Toggle);
            if(toggle){
                toggle.isChecked = cc.vv.userMgr.clubUsers[cc.vv.userMgr.club_id][node.myTag].job == 2;
                //cc.vv.userMgr.clubUsers[cc.vv.userMgr.club_id][userid].job = toggle.isChecked?2:1;
            }
        }
    },

    addAdm:function(){
        var count = 0;
        for(var i = 0; i < this.adminList.childrenCount; i++){
            var node = this.adminList.children[i];
            if(node.name != "ClubAddAdm"){
                count++;
            }
        }
        if(count >= 5){
            cc.vv.popMgr.tip('管理员最多五个');
            return;
        }
        cc.vv.popMgr.pop('club/NormalUsersList',function(obj){
            cc.vv.club._normalUsersList = obj;
            obj.getComponent('NormalUsersList').init();
        });
    },

    addBtn_adm:function(){
        var node = cc.instantiate(this.clubAddAdm);
        this.adminList.addChild(node);
    },

    onDestroy:function(){
        cc.vv.hall.removeHandler('club_list_battle_log');
    },

    onClickBack(){
        cc.vv.memberBack = false;
        cc.vv.club._clubSet = null;
        this.node.destroy();
        if(cc.vv.club.clubMain){
            cc.vv.club.clubMain.active = true;
        }
       
    }
    // update (dt) {},
});
