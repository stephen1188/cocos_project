cc.Class({
    extends: cc.Component,

    properties: {
        listPrefab:cc.Prefab,
    },

    
    onBtnClicked:function(event){
        if(!cc.vv.userMgr.clubUsers[cc.vv.userMgr.club_id][cc.vv.userMgr.userid]){
            return;
        }
        var myjob = cc.vv.userMgr.clubUsers[cc.vv.userMgr.club_id][cc.vv.userMgr.userid].job;
        if(myjob < 1){
            cc.vv.popMgr.tip('您不是管理员,没有权限操作');
            return;
        }
        cc.vv.club._clubSet.getComponent('ClubSetting').addAdm();
        
    }

    // update (dt) {},
});
