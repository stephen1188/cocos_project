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
    },
    
    show:function(){
        this.list.removeAllChildren();
        var rules = cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].rules;
        for(var i = 0; i < rules.length; ++i){
            var prefab = null;
            if(rules[i].type == 0){
                prefab = this.ptzPrefab;
            }else{
                prefab = this.pwzPrefab;
            }
            var node = cc.instantiate(prefab);
            this.list.addChild(node);
            node.getChildByName('option').active = false;
            node.getChildByName('name_edit').active = false;
            node.emit("new",rules[i]); 
            node.getComponent('ClubNewRule').info(rules[i],1);
        }
    }
});
