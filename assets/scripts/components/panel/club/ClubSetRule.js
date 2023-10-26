cc.Class({
    extends: cc.Component,

    properties: {
        ptzPrefab:cc.Prefab,
        pwzPrefab:cc.Prefab,
        list:cc.Node,
    },

    onLoad:function(){
        if(cc.winSize.width / cc.winSize.height - 16 / 9 > 0.1){ 
            
            var width = cc.winSize.width;
            this.node.width = width;
        }
        var viewlist = this.node.getChildByName('viewlist');
        viewlist.width = this.node.width - 341;
        viewlist.getChildByName('view').width = viewlist.width;
    },

    show:function(){
        this.list.removeAllChildren();
        var rules = cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].rules;

        rules.sort((a , b)=>{
            return b.id - a.id;
        })
        for(var i = 0; i < rules.length; ++i){
            var prefab = null;
            if(rules[i].type == 0){
                prefab = this.ptzPrefab;
            }else{
                prefab = this.pwzPrefab;
            }
            var node = cc.instantiate(prefab);
            this.list.addChild(node);
            node.getComponent('ClubNewRule').info(rules[i],0);

        }
    },
    // 参数三 是否手动点击
    createRule:function(data){
        var node = cc.vv.utils.getChildByTag(this.list,data.id);
        if(node !== null){
            node.getComponent('ClubNewRule').info(data,0);
            return;
        }
        var prefab = null;
        if(data.type == 0){
            prefab = this.ptzPrefab;
        }else{
            prefab = this.pwzPrefab;
        }

        this.resetZIndex();
        var newNode = cc.instantiate(prefab);
        this.list.addChild(newNode , 0);
        newNode.getComponent('ClubNewRule').info(data,0);
    },

    resetZIndex(){
        for (let i = 0; i < this.list.childrenCount; i++) {
            this.list.children[i].zIndex = i + 1;
        }
    },

    getRule:function(id){
        var node = cc.vv.utils.getChildByTag(this.list,id);
        if(node != null){
            return node;
        }
        return null;
    },

    removeRule:function(id,clubid){
        var node = cc.vv.utils.getChildByTag(this.list,id);
        if(node !== null){
            node.destroy();
        }

        var rules = cc.vv.userMgr.clublist[clubid].rules;
        for(var i = 0; i < rules.length; ++i){
            if(rules[i].id == id){
                rules.splice(i,1);
                break;
            }
        }
        cc.vv.club.clubMain.getChildByName("room").getComponent('ClubRoomList').removeRuleRoom(id,clubid);
        cc.vv.club.clubMain.emit("club_room_list",{type:1});
    },

    onBtnClicked:function(event){
        cc.vv.audioMgr.click();
        switch(event.target.name){
            case "addrule":{
                cc.vv.userMgr.club_rule_id = 0;
                cc.vv.popMgr.pop('club/ClubSelectType');
            }
            break;
            case "btn_back":{
               cc.vv.popMgr.del_pop("new_CreateRoom");
            }
            break;
        }
    }
});
