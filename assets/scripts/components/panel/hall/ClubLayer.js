cc.Class({
    extends: cc.Component,

    properties: {
        btnCreate:cc.Node,
    },

    start () {
        this.initView();
    },

    initView:function(){
        //非代理，不显示创建亲友圈
        //this.btnCreate.active = cc.vv.userMgr.is_dealer;
    },

        /**
     * 按钮处理
     */
    onBtnClicked:function(event){

        cc.vv.audioMgr.click();
        var self = this;

        switch(event.target.name){
            case "group_btn_join":{
                cc.vv.popMgr.pop("club/JoinClub");
            }
            break;
            case "group_btn_create":{
                cc.vv.popMgr.pop("club/CreateClub");
            }
            break;
            case "group_btn_list":{

                if(cc.vv.userMgr.clublist == null || cc.vv.userMgr.clublist.lenght == 0){
                    cc.vv.popMgr.alert("您还未还没加入任何乐圈");
                    return;
                }

                cc.vv.club.clubMain.active = true;
                cc.vv.club.clubMain.getComponent('ClubMain').show(cc.vv.userMgr.club_id);
                this.node.active = false;
            }
            break;
        }
    },
});
