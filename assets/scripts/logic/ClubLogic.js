cc.Class({
    extends: cc.Component,

    properties: {
        list:cc.Node,
        clubItem:cc.Prefab,
        clubList:cc.Node,
        clubMain:cc.Node,
        // clubList:cc.Node,
        clubNotic:cc.Node,
        _clubMsg:null,
        _clubMember:null,
        _clubPwb:null,
        _clubPwb2:null,
        _clubPwbList:null,
        _clubSet:null,
        _clubDetail:null,
        _clubSetRule:null,
    },

   
    onLoad (){
        cc.vv.club = this;

        //清空房间列表，让点击的时候重新获取
        cc.vv.userMgr.clubRoom = null;
        //this.myclub(cc.vv.userMgr.clublist);
        cc.vv.club.clubNotice = 0;
        cc.vv.userMgr.club_id = 0;
    },

    start () {
        this.initEventHandlers();
        this.initView();
    },

    initView:function(){
        //非代理，不显示创建亲友圈
        //this.btnCreate.active = cc.vv.userMgr.is_dealer;
    },

    /**
     * 大厅监听
     */
    initEventHandlers: function() {

        //初始化事件监听器
        var self = this;
        cc.vv.gameClubMgr.dataEventHandler = this.node;
        //亲友圈已开房间列表
        this.node.on('club_room_list_plugs', function (ret) {

            
            var data = ret.data;
            cc.vv.club.clubMain.emit("club_room_list",{type:1});

        });

        //亲友圈已开房间 单个刷新
        this.node.on('club_room_plugs', function (ret) {

            
            var data = ret.data;
            
            cc.vv.club.clubMain.emit('club_room',data);
            
        });
        //亲友圈已开房间 单个刷新
        this.node.on('club_room_del_plugs', function (ret) {

            
            var data = ret.data;
           
            cc.vv.club.clubMain.emit('club_room_del',ret);
        });

        //创建房间
        this.node.on('club_room_create', function (ret) {

            
            var data = ret.data;
            cc.vv.popMgr.hide();
            //滚动公告
            if(ret.errcode !== 0){
                if(ret.errcode == -3){
                    var ok = function(){
                        cc.vv.userMgr.join(data.roomid,data.clubid,0);
                    };
                    var cancel = function(){
                        var club = cc.vv.utils.getChildByTag(cc.vv.club.clubMain.getChildByName('room'),data.clubid);
                        var room = cc.vv.utils.getChildByTag(club.getComponent(cc.ScrollView).content,data.id+'');
                        if(room && cc.isValid(room)){
                            room.getComponent('ClubRoomItem').create_joinRoom(1);
                        }   
                    };
                    cc.vv.popMgr.pop('club/ClubRoomAlert',function(obj){
                        obj.getComponent("Alert").show(ret.errmsg,ok,true,cancel);
                    })
                }else{
                    cc.vv.popMgr.alert(ret.errmsg);
                }
                return;
            }
            //cc.vv.userMgr.clubRoomEnter = data.clubid;
        });

        //删除规则
        this.node.on('club_delete_rule_pwz',function(ret){
            
            var data = ret.data;
            cc.vv.popMgr.hide();
            if(ret.errcode !== 0){
                cc.vv.popMgr.alert(ret.errmsg);
                return;
            }
            cc.vv.club._clubSetRule.getComponent('ClubSetRule').removeRule(data.id,data.clubid);
        });

        //删除规则
        this.node.on('club_delete_rule_ptz',function(ret){
            
            var data = ret.data;
            cc.vv.popMgr.hide();
            if(ret.errcode !== 0){
                cc.vv.popMgr.alert(ret.errmsg);
                return;
            }
            cc.vv.club._clubSetRule.getComponent('ClubSetRule').removeRule(data.id,data.clubid);
        });

        //设置默认规则
        this.node.on('club_create_rule_pwz_def',function(ret){
            
            var data = ret.data;
            cc.vv.popMgr.hide();
            if(ret.errcode !== 0){
                cc.vv.popMgr.alert(ret.errmsg);
                return;
            }

            for(var i = 0; i < cc.vv.userMgr.clublist[data.clubid].pwz.length; ++i){
                if(data.default == 1){
                    if(data.id != cc.vv.userMgr.clublist[data.clubid].pwz[i].id){
                        cc.vv.userMgr.clublist[data.clubid].pwz[i].default = 0;
                        continue;
                    }
                    cc.vv.userMgr.clublist[data.clubid].pwz[i].default = 1;
                }
                else{
                    cc.vv.userMgr.clublist[data.clubid].pwz[i].default = 0;
                }
            }
            if(data.default == 1){
                cc.vv.club._clubSet.getComponent('ClubSetting').setDefaultRule(data.id);
            }
            
            cc.vv.popMgr.tip("修改晋级赛开房规则成功");
        });

         //修改排位桌规则
         this.node.on('club_create_rule_pwz',function(ret){
            
            var data = ret.data;
            cc.vv.popMgr.hide();
            if(ret.errcode !== 0){
                cc.vv.popMgr.alert(ret.errmsg);
                return;
            }
            cc.vv.userMgr.guodi = 0;
            var isAdd = true;
            for(var i = 0; i < cc.vv.userMgr.clublist[data.clubid].rules.length; ++i){
                if(data.id == cc.vv.userMgr.clublist[data.clubid].rules[i].id){
                    cc.vv.userMgr.clublist[data.clubid].rules[i] = data;
                    isAdd = false;
                    break;
                }
            }
            if(isAdd){
                cc.vv.userMgr.clublist[data.clubid].rules.push(data);
            }
            
            cc.vv.club.clubMain.emit("club_room_list",{type:1});
            cc.vv.club._clubSetRule.getComponent('ClubSetRule').createRule(data);
            cc.vv.popMgr.tip("修改晋级赛开房规则成功");
        });

        //修改普通桌规则
        this.node.on('club_create_rule_ptz',function(ret){

            cc.vv.popMgr.hide();

            
            var data = ret.data;
            if(ret.errcode !== 0){
                cc.vv.popMgr.alert(ret.errmsg);
                return;
            }

            var isAdd = true;
            for(var i = 0; i < cc.vv.userMgr.clublist[data.clubid].rules.length; ++i){
                if(data.id == cc.vv.userMgr.clublist[data.clubid].rules[i].id){
                    cc.vv.userMgr.clublist[data.clubid].rules[i] = data;
                    isAdd = false;
                    break;
                }
            }
            if(isAdd){
                cc.vv.userMgr.clublist[data.clubid].rules.push(data);
            }
            cc.vv.club.clubMain.emit("club_room_list",{type:1});
            cc.vv.club._clubSetRule.getComponent('ClubSetRule').createRule(data);
            cc.vv.popMgr.tip("修改普通桌开房规则成功");
        });

        //加圈申请
        this.node.on('club_user_join',function(ret){

            
            var data = ret.data;
            
            if(ret.errcode !== 0){
                cc.vv.popMgr.alert(ret.errmsg);
                return;
            }
            
            cc.vv.popMgr.alert("您已经提交了加入申请，请等待管理员审核");
        });
        
        //亲友圈列表
        this.node.on('club_list_plugs', function (ret) {

            var data = ret.data;
            

            if(ret.errcode !== 0){
                cc.vv.popMgr.alert(ret.errmsg);
                cc.vv.popMgr.hide();
                return;
            }

            self.clubList.active = data.list.length !== 0;

            //缓存亲友圈信息
            cc.vv.userMgr.clublist = {}
            
            for(var i=0;i<data.list.length;++i){
                cc.vv.userMgr.clublist[data.list[i].club_id] = data.list[i];
            }
        });

        //亲友圈信息
        this.node.on('club_info', function (ret) {
            var data = ret.data;
            
            cc.vv.popMgr.hide();
            if(ret.errcode !== 0){
                cc.vv.popMgr.alert(ret.errmsg);
                return;
            }

            if(cc.vv.userMgr.clublist == null){
                cc.vv.userMgr.clublist = {}
            }

            cc.vv.userMgr.club_id = data.club_id;
            cc.vv.userMgr.clublist[data.club_id] = data;
            
            // self.clubNotic.active = false;
            self.clubList.active = true;
            if(cc.vv.club.clubMain.active){
                cc.vv.club.clubMain.getComponent('ClubMain').show(cc.vv.userMgr.club_id);
            }
            //self.myclub(cc.vv.userMgr.clublist);
        });

        //创建亲友圈
        this.node.on('club_add', function (ret) {
            var data = ret.data;
            

            cc.vv.popMgr.hide();

            if(ret.errcode !== 0){
                cc.vv.popMgr.alert(ret.errmsg);
                return;
            }

            //新增加的
            cc.vv.userMgr.club_id = data.club_id;
            cc.vv.popMgr.tip("乐圈创建成功");
        });

        //亲友圈成员列表
        this.node.on('club_users', function (ret) {
            var data = ret.data;
            
            cc.vv.popMgr.hide();
            if(ret.errcode !== 0){
                cc.vv.popMgr.alert(ret.errmsg);
                return;
            }
            if(data.type == 5){ // 防止设置管理串数据 搜索
                let normaldata = {};
                normaldata[data.clubid] = {};
                for(var i=0;i<data.list.length;++i){
                    normaldata[data.clubid][data.list[i].userid] = data.list[i];
                }
                if(cc.vv.club._normalUsersList && cc.vv.club._normalUsersList.active){
                    cc.vv.club._normalUsersList.getComponent('NormalUsersList').init(true,normaldata);
                }

                return;
            }
            cc.vv.userMgr.clubUsers = {};
            cc.vv.userMgr.clubUsers[data.clubid] = {};
            for(var i=0;i<data.list.length;++i){
                cc.vv.userMgr.clubUsers[data.clubid][data.list[i].userid] = data.list[i];
            }
            if(cc.vv.userMgr.clubUsers[cc.vv.userMgr.club_id][cc.vv.userMgr.userid]){
                cc.vv.userMgr.user_job = cc.vv.userMgr.clubUsers[cc.vv.userMgr.club_id][cc.vv.userMgr.userid].job
            }
            cc.vv.club.users = 1;
          
            switch(data.type){
                case 0:{
                    //成员列表
                    cc.vv.club._clubMember.getComponent('ClubMemberList').getMemberList(data.list);
                }
                break;
                case 1:{
                    //设置
                    cc.vv.club._clubSet.getComponent('ClubSetting').init();
                    
                }
                break;
                
                case 2:{
                    //圈子详情
                }
                break;
                case 3:{
                    //申请列表
                    cc.vv.popMgr.wait("正在获取审核列表",function(){
                        cc.vv.net1.quick("club_joins",{club_id:cc.vv.userMgr.club_id});
                    });
                }
                break;
                case 4:{
                    if(cc.vv.club._clubSet && cc.vv.club._clubSet.active){
                        cc.vv.club._clubSet.getComponent('ClubSetting').admSet();
                    }
                }
                break;
                case 5:{
                   
                }
                break;
            }
            
        });

        //胜点清单
        this.node.on('club_pwb_list', function (ret) {
            var data = ret.data;
            
            cc.vv.popMgr.hide();
            if(ret.errcode !== 0){
                cc.vv.popMgr.alert(ret.errmsg);
                return;
            }
            if(cc.vv.club._clubPwbList === null){
                cc.vv.popMgr.pop('club/ClubPwbList',function(obj){
                    cc.vv.club._clubPwbList = obj;
                    cc.vv.club._clubPwbList.zIndex = 100;
                    obj.getComponent('ClubPwbList').show(data);
               });
            }
            else{
                cc.vv.club._clubPwbList.active = true;
                cc.vv.club._clubPwbList.getComponent('ClubPwbList').show(data);
            }
            
        });

        //新的申请通知
        this.node.on('club_notice_plugs',function(ret){
            var data = ret.data;
            

            if(ret.errcode !== 0){
                cc.vv.popMgr.alert(ret.errmsg);
                cc.vv.popMgr.hide();
                return;
            }
            cc.vv.club.clubMain.getComponent('ClubMain').show(cc.vv.userMgr.club_id);
        });

        //申请加入列表
        this.node.on('club_joins', function (ret) {
            var data = ret.data;
            
            cc.vv.popMgr.hide();
            if(ret.errcode !== 0){
                cc.vv.popMgr.alert(ret.errmsg);
                return;
            }
           
            if(cc.vv.club.clubNotice == 0){
                cc.vv.club.clubMain.getComponent('ClubMain').clubNotice(data.list);
            }
            else{
                cc.vv.club._clubMsg.getComponent('ClubMessage').getMsgList(data.list);
                cc.vv.club.clubMain.getComponent('ClubMain').clubNotice(data.list);
            }
        });

        //同意申请加圈
        this.node.on('club_user_review', function (ret) {
            var data = ret.data;
            

            cc.vv.club.clubNotice = 0;
            cc.vv.popMgr.wait("正在获取审核列表",function(){
                cc.vv.net1.quick("club_joins",{club_id:cc.vv.userMgr.club_id});
            });
            if(ret.errcode !== 0){
                cc.vv.popMgr.alert(ret.errmsg);
                // if(ret.errcode == -2){
                //     cc.vv.club._clubMsg.getComponent('ClubMessage').removeUser(data.userid);
                // }
                cc.vv.popMgr.hide();
                return;
            }
            cc.vv.club._clubMsg.getComponent('ClubMessage').removeUser(data.userid);
        });

        //拒绝加圈申请
        this.node.on('club_user_refused', function (ret) {
            var data = ret.data;
            

            cc.vv.club.clubNotice = 0;
            cc.vv.popMgr.wait("正在获取审核列表",function(){
                cc.vv.net1.quick("club_joins",{club_id:cc.vv.userMgr.club_id});
            });
            if(ret.errcode !== 0){
                cc.vv.popMgr.alert(ret.errmsg);
                cc.vv.popMgr.hide();
                return;
            }
            cc.vv.club._clubMsg.getComponent('ClubMessage').removeUser(data.userid);
        });

        //踢人
        this.node.on('club_user_kick', function (ret) {
            var data = ret.data;
            
            if(ret.errcode !== 0){
                cc.vv.popMgr.alert(ret.errmsg);
                cc.vv.popMgr.hide();
                return;
            }
            if(data.userid == cc.vv.userMgr.userid){
                delete cc.vv.userMgr.clublist[data.club_id];
                cc.vv.userMgr.club_id =0;
                cc.vv.club.clubMain.active = true;
                cc.vv.club.clubMain.getComponent('ClubMain').show(cc.vv.userMgr.club_id);
            }
            cc.vv.club._clubPwb.active = false;
            if(!cc.vv.club._clubMember){
                return;
            }
            cc.vv.club._clubMember.getComponent('ClubMemberList').removeUser(data.userid+'');
        });

        //禁玩
        this.node.on('club_user_black', function (ret) {
            var data = ret.data;
            
            if(ret.errcode !== 0){
                cc.vv.popMgr.alert(ret.errmsg);
                cc.vv.popMgr.hide();
                return;
            }
            cc.vv.userMgr.clubUsers[data.clubid][data.userid].status = data.status;
            cc.vv.club._clubPwb.getComponent('UserManager').refreshBtns(1,data.status);
            cc.vv.club._clubPwb.getComponent('UserManager').userStatus(data.status);
        });

        //修改胜点
        this.node.on('club_user_pwb_plugs', function (ret) {
            var data = ret.data;
            
            cc.vv.club._clubPwb.getComponent('UserManager').newPwb(data.pwb);
            cc.vv.club.clubMain.getComponent('ClubMain').refresh(data);
        });

        //设置管理员
        this.node.on('club_user_admin', function (ret){
            var data = ret.data;
            
            cc.vv.popMgr.hide();
            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                cc.vv.club._clubSet.getComponent('ClubSetting').admSet();
                return;
            }
            cc.vv.userMgr.clubUsers[data.clubid][data.userid].job = data.job;
            if(data.job == 2){
                cc.vv.club._clubSet.getComponent('ClubSetting').setSuperAdm(data.userid);
            }
            cc.vv.club._clubSet.getComponent('ClubSetting').admSet();
        });

        //亲友圈属性
        this.node.on('club_property',function(ret){
            var data = ret.data;
            

            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                cc.vv.popMgr.hide();
                return;
            }
        });

        //亲友圈统计
        this.node.on('club_count',function(ret){
            var data = ret.data;
            

            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                cc.vv.popMgr.hide();
                return;
            }
            cc.vv.club._clubDetail.getComponent('ClubDetail').count(data);
        });

        //亲友圈历史记录
        this.node.on('club_list_battle_log',function(ret){
            cc.vv.popMgr.hide();
            
            var data = ret.data;
            

            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                cc.vv.popMgr.hide();
                return;
            }
            cc.vv.club._clubSet.getComponent('ClubSetting').getHistory(data.battleLogList);
        });

        //圈子战绩
        this.node.on('club_history',function(ret){
            cc.vv.popMgr.hide();
            
            var data = ret.data;
            

            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                cc.vv.popMgr.hide();
                return;
            }
            cc.vv.club._clubSet.getComponent('ClubSetting').getHistory(data.list);
        });

        //管理员列表
        this.node.on('club_admin_list',function(ret){
            cc.vv.popMgr.hide();
            
            var data = ret.data;
            

            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                cc.vv.popMgr.hide();
                return;
            }
            cc.vv.club._clubSet.getComponent('ClubSetting').admSet(data.admin_list);
        });


         //战绩战绩分局信息
         this.node.on('club_history_round', function (ret) {
            cc.vv.popMgr.hide();
            var data = ret.data;
            

            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                return;
            }
            cc.vv.club._clubSet.getComponent('ClubSetting').round(data);
        });

        //战绩战绩分局信息
        this.node.on('club_history_replay', function (ret) {
            
            var data = ret.data;
            if(ret.errcode !== 0){
                cc.vv.popMgr.hide();
                cc.vv.popMgr.alert(ret.errmsg);
                return;
            }

            cc.vv.popMgr.wait("正在进入房间");
            cc.vv.roomMgr.enter = data.enter;
            cc.vv.roomMgr.table = data.table;
            cc.vv.roomMgr.param = data.param;
            cc.vv.roomMgr.action = data.action;
            cc.vv.roomMgr.jiesuan = data.jiesuan;
            cc.vv.roomMgr.roomid = data.enter.room_id;
            cc.vv.roomMgr.ren = data.enter.ren;
            cc.vv.roomMgr.now = data.enter.round;
            cc.vv.roomMgr.max = data.enter.max_round;
            cc.vv.roomMgr.room_type = data.param.model;

            //是否在回放
            cc.vv.roomMgr.is_replay = true;
            cc.director.loadScene(cc.vv.roomMgr.room_type);
        });

        //亲友圈转出
        this.node.on('club_creator_update',function(ret){
            cc.vv.popMgr.hide();

            var data = ret.data;
            

            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                return;
            }
            delete cc.vv.userMgr.clublist[data.clubid];
            for(var i = 0; i < cc.vv.userMgr.clublist2.length; i++){
                if(data.clubid == cc.vv.userMgr.clublist2[i].club_id){
                    cc.vv.userMgr.clublist2.splice(i,1);
                    break;
                }
            }
            cc.vv.club.clubMain.getComponent('ClubMain').removeClub(data.clubid);
            cc.vv.userMgr.club_id = 0;
            cc.vv.club.clubMain.getComponent('ClubMain').show(cc.vv.userMgr.club_id);
            //self.myclub(cc.vv.userMgr.clublist);
            cc.vv.club._clubDetail.active = false;
        });

        //亲友圈转出通知给其他人
        this.node.on('club_creator_change_notify',function(ret){
            var data = ret.data;
            

            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                cc.vv.popMgr.hide();
                return;
            }
        });

        //胜点改变通知
        this.node.on('club_user_pwb_change_plugs',function(ret){
            var data = ret.data;
            

            if(cc.vv.userMgr.club_id == data.clubid){
                cc.vv.club.clubMain.getComponent('ClubMain').newPwb(data);
            }
        });

        //群主发送邀请协议
        this.node.on('club_user_invite',function(ret){
            var data = ret.data;
            

            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                cc.vv.popMgr.hide();
                return;
            }
            cc.vv.popMgr.tip('邀请已发出,等待用户同意或拒绝');
            
        });

        //被邀请人接受或拒绝邀请
        this.node.on('user_invite_result',function(ret){
            var data = ret.data;
            

            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                cc.vv.popMgr.hide();
                return;
            }
            
        });

        //消息type=1时发送协议
        this.node.on('user_invite_notice_by_message',function(ret){
            var data = ret.data;
            

            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                cc.vv.popMgr.hide();
                return;
            }
            
        });

        //消息type=3时发送协议
        this.node.on('invite_user_dealer_notice_by_message',function(ret){
            var data = ret.data;
            
            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                cc.vv.popMgr.hide();
                return;
            }
            
        });
        //接收邀请协议
        this.node.on('user_invite_notice',function(ret){
            var data = ret.data;
            

            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                cc.vv.popMgr.hide();
                return;
            }
            cc.vv.popMgr.pop("club/ClubInviteNotice",function(obj){
                obj.getComponent('ClubInviteNotice').joinClub(data);
            });
        });
        //个人 统计详情
        this.node.on('club_reward_list',function(ret){
            var data = ret.data;
            

            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                cc.vv.popMgr.hide();
                return;
            }
            cc.vv.popMgr.pop("club/ClubAliebiao",function(obj){
                obj.getComponent('ClubAliebiao').show(data);
            });
        });
        //接收邀请协议
        this.node.on('user_invite_dealer_notice',function(ret){
            var data = ret.data;
            

            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                cc.vv.popMgr.hide();
                return;
            }
            cc.vv.popMgr.pop("club/ClubInviteNotice",function(obj){
                obj.getComponent('ClubInviteNotice').dealer(data);
            });
        });
        //新增一个胜点查询接口
        this.node.on('club_user_friend_pwb',function(ret){
            var data = ret.data;
            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                cc.vv.popMgr.hide();
                return;
            }
            if(!cc.vv.club._clubMember){
                return;
            }
            // cc.vv.userMgr.clubUsers[data.club_id][data.user_id].pwb = data.pwb;
            var node = cc.vv.club._clubMember.getComponent('ClubMemberList').getFriend(data.user_id);
            node.getComponent('ClubFriend').memberinfo(data);
        });
        //获取成员胜点
        this.node.on('club_user_view_pwb',function(ret){
            var data = ret.data;
            

            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                cc.vv.popMgr.hide();
                return;
            }
            if(!cc.vv.userMgr.clubUsers[data.club_id]){
                return;
            }
            cc.vv.userMgr.clubUsers[data.club_id][data.user_id].pwb = data.pwb;
            if(!cc.vv.club._clubMember){
                return;
            }
            var node = cc.vv.club._clubMember.getComponent('ClubMemberList').getMember(data.user_id);
            node.getComponent('ClubMemberItem').memberinfo(data);
        });

        //排行榜
        this.node.on('club_user_count',function(ret){
            var data = ret.data;
            
            cc.vv.popMgr.hide();
            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                return;
            }
            cc.vv.club._clubDetail.getComponent('ClubDetail').initRank(data);
        });
        this.node.on('club_user_reward',function(ret){
            var data = ret.data;
            
            cc.vv.popMgr.hide();
            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                return;
            }
            cc.vv.club._clubDetail.getComponent('ClubDetail').updateDelarFit(data);
        });
        this.node.on('club_info_view_plugs',function(ret){
            var data = ret.data;
            

            if(cc.vv.club._clubDetail != null){
                cc.vv.club._clubDetail.getComponent('ClubDetail').info(data);
            }
            if(cc.vv.userMgr.club_id == data.club_id){
                cc.vv.club.clubMain.getComponent('ClubMain').show(cc.vv.userMgr.club_id);
            }
            
        });

        this.node.on('club_user_count_view',function(ret){
            var data = ret.data;
            
            cc.vv.popMgr.hide();
            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                return;
            }
            if(cc.vv.userMgr.clublist[data.clubId]){
                cc.vv.userMgr.clublist[data.clubId].user = data.count;
            }
           
            if(cc.vv.club._clubDetail != null){
                cc.vv.club._clubDetail.getComponent('ClubDetail').userInfo(data);
            }
        });

        //圈子列表变化
        this.node.on('club_add_del_plugs',function(ret){
            var data = ret.data;
            if(data.type == undefined){
                self.clubList.active = true;
                // cc.vv.userMgr.clublist2.push(data);
                // data.myTag = cc.vv.userMgr.clublist2.length-1;
                // cc.vv.userMgr.clublist[data.club_id] = data;
                if(cc.vv.club.clubMain.active){
                    cc.vv.userMgr.club_id = data.club_id;
                    cc.vv.club.clubMain.getComponent('ClubMain').show(cc.vv.userMgr.club_id);
                }else{
                    cc.vv.userMgr.club_id = 0;
                }
            }else{
                cc.vv.userMgr.club_id = 0;
                // delete cc.vv.userMgr.clublist[data.club_id];
                // for(var i = 0; i < cc.vv.userMgr.clublist2.length; i++){
                //     if(data.club_id == cc.vv.userMgr.clublist2[i].club_id){
                //         cc.vv.userMgr.clublist2.splice(i,1);
                //         break;
                //     }
                // }
                cc.vv.club.clubMain.getComponent('ClubMain').removeClub(data.club_id);
                var room = cc.vv.utils.getChildByTag(cc.vv.club.clubMain.getChildByName('room'),data.club_id);
                if(room != null){
                    room.destroy();
                }
                if(JSON.stringify(cc.vv.userMgr.clublist) == '{}'){
                    self.clubList.active = false;
                }
                if(cc.vv.club.clubMain.active){
                    cc.vv.club.clubMain.getComponent('ClubMain').show(cc.vv.userMgr.club_id);
                }
                if(cc.vv.club._clubDetail && cc.vv.club._clubDetail.active){
                    cc.vv.club._clubDetail.active = false;
                }
                if(cc.vv.club._clubPwbList && cc.vv.club._clubPwbList.active){
                    cc.vv.club._clubPwbList.active = false;
                }
                if(cc.vv.club._clubMember && cc.vv.club._clubMember.active){
                    cc.vv.club._clubMember.active = false;
                }
            }
            //self.myclub(cc.vv.userMgr.clublist);
        });

        //被转让者圈子变更
        this.node.on('club_creator_update_view_plugs',function(ret){
            var data = ret.data;
            
    
            if(cc.vv.userMgr.club_id == data.club_id){
                if(cc.vv.club.clubMain.active){
                    cc.vv.club.clubMain.getComponent('ClubMain').show(data.club_id);
                }
            }
        });

        
        //退圈
        this.node.on('club_remove',function(ret){
            var data = ret.data;
            
            cc.vv.popMgr.hide();
            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                return;
            }
            if(data.userid == cc.vv.userMgr.userid){
                delete cc.vv.userMgr.clublist[data.clubid];
                for(var i = 0; i < cc.vv.userMgr.clublist2.length; i++){
                    if(data.clubid == cc.vv.userMgr.clublist2[i].club_id){
                        cc.vv.userMgr.clublist2.splice(i,1);
                        break;
                    }
                }
                cc.vv.club.clubMain.getComponent('ClubMain').removeClub(data.clubid);
                cc.vv.userMgr.club_id = 0;
                var room = cc.vv.utils.getChildByTag(cc.vv.club.clubMain.getChildByName('room'),data.clubid);
                if(room != null){
                    room.destroy();
                }
                if(JSON.stringify(cc.vv.userMgr.clublist) == '{}'){
                    cc.vv.club.clubMain.active = false;
                    self.clubList.active = false;
                }
                else{
                    cc.vv.club.clubMain.active = true;
                    cc.vv.club.clubMain.getComponent('ClubMain').show(cc.vv.userMgr.club_id);
                }
                //self.myclub(cc.vv.userMgr.clublist);
            }
            cc.vv.popMgr.tip('退出乐圈成功');
            cc.vv.club._clubDetail.active = false;
        });

        //退圈
        this.node.on('club_user_exit',function(ret){
            var data = ret.data;
            
            cc.vv.popMgr.hide();
            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                return;
            }
            if(data.userid == cc.vv.userMgr.userid){
                delete cc.vv.userMgr.clublist[data.clubid];
                for(var i = 0; i < cc.vv.userMgr.clublist2.length; i++){
                    if(data.clubid == cc.vv.userMgr.clublist2[i].club_id){
                        cc.vv.userMgr.clublist2.splice(i,1);
                        break;
                    }
                }
                cc.vv.club.clubMain.getComponent('ClubMain').removeClub(data.clubid);
                cc.vv.userMgr.club_id = 0;
                var room = cc.vv.utils.getChildByTag(cc.vv.club.clubMain.getChildByName('room'),data.clubid);
                if(room != null){
                    room.destroy();
                }
                if(JSON.stringify(cc.vv.userMgr.clublist) == '{}'){
                    cc.vv.club.clubMain.active = false;
                    self.clubList.active = false;
                }
                else{
                    cc.vv.club.clubMain.active = true;
                    cc.vv.club.clubMain.getComponent('ClubMain').show(cc.vv.userMgr.club_id);
                }
                //self.myclub(cc.vv.userMgr.clublist);
            }
            cc.vv.popMgr.tip('退出乐圈成功');
            cc.vv.club._clubDetail.active = false;
        });

        this.node.on('club_rule_ptz_view_plugs',function(ret){
            var data = ret.data;
            
            
            if(cc.vv.club._clubSetRule != null && cc.vv.club._clubSetRule.active){
                cc.vv.club._clubSetRule.getComponent('ClubSetRule').show();
            }
            if(cc.vv.club._clubGameList != null && cc.vv.club._clubGameList.active){
                cc.vv.club._clubGameList.getComponent('ClubGameList').show();
            }

            if(data.type == 1){
                if(data.club_id == cc.vv.userMgr.club_id){
                    cc.vv.club.clubMain.emit("club_room_list",{type:1});
                }
            }else{
                cc.vv.club.clubMain.getChildByName("room").getComponent('ClubRoomList').removeRuleRoom(data.id,data.club_id);
            }
             
        });

        this.node.on('club_rule_pwz_view_plugs',function(ret){
            var data = ret.data;
            
           
            if(cc.vv.club._clubSetRule != null && cc.vv.club._clubSetRule.active){
                cc.vv.club._clubSetRule.getComponent('ClubSetRule').show();  
            }
            if(cc.vv.club._clubGameList != null && cc.vv.club._clubGameList.active){
                cc.vv.club._clubGameList.getComponent('ClubGameList').show();
            }
            if(data.type == 1){
                if(data.club_id == cc.vv.userMgr.club_id){
                    cc.vv.club.clubMain.emit("club_room_list",{type:1});
                }
            }else{
                cc.vv.club.clubMain.getChildByName("room").getComponent('ClubRoomList').removeRuleRoom(data.id,data.club_id);
            }
        });

        this.node.on('club_user_admin_view_plugs',function(ret){
            var data = ret.data;
            
            
        });

        this.node.on('club_edit',function(ret){
            var data = ret.data;
            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                cc.vv.popMgr.hide();
                return;
            }
            cc.vv.popMgr.tip('修改乐圈信息成功');

            cc.vv.userMgr.club_id = data.club_id;
            cc.vv.club.clubMain.active = true;
            cc.vv.club.clubMain.getComponent('ClubMain').show(cc.vv.userMgr.club_id);
        });

        this.node.on('club_update',function(ret){
            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                cc.vv.popMgr.hide();
                return;
            }
            cc.vv.popMgr.tip('升级成功');
            //cc.vv.club._clubDetail.getComponent('ClubDetail').hideUpdate();
        });

        this.node.on('club_count_clear',function(ret){
            cc.vv.popMgr.hide();
            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                return;
            }
            cc.vv.popMgr.tip('清除统计成功');
        })

        this.node.on('club_score',function(ret){
            var data = ret.data;
            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                cc.vv.popMgr.hide();
                return;
            }
            for(var i = 0; i < data.list.length; ++i){
                for(var j in cc.vv.userMgr.clublist){
                    if(data.list[i].club_id == cc.vv.userMgr.clublist[j].club_id){
                        cc.vv.userMgr.clublist[j].pwb = data.list[i].pwb;
                        cc.vv.userMgr.clublist[j].ticket = data.list[i].ticket;
                        break; 
                    }                            
                }
            }
            if(cc.vv.userMgr.club_id != null){
                cc.vv.club.clubMain.getComponent('ClubMain').show(cc.vv.userMgr.club_id);
            }
        });

        this.node.on('club_user_online_list',function(ret){
            cc.vv.popMgr.hide();
            var data = ret.data;
            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                return;
            }
            if(!cc.vv.club._clubMember){
                return;
            }
            cc.vv.club._clubMember.getComponent('ClubMemberList').getOnlineList(data.list);
        });
        //修改自己是否给上级玩家 上下分权限 
        this.node.on('update_club_user_pwdSwitch',function(ret){
            cc.vv.popMgr.hide();
            if(!cc.vv.club._clubMember){
                return;
            }
            cc.vv.club._clubMember.getComponent('ClubMemberList').Change_switch(ret);
        });
        //上下分开关的那两个！！！！！！！！！！！！！
        this.node.on('update_club_user_pwdSwitch_sendCode',function(ret){
            cc.vv.popMgr.hide();
            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                return;
            }
            cc.vv.popMgr.pop("club/ClubInputCode",function(obj){
                obj.getComponent("ClubInputCode").info(ret.errmsg);
            });
            
        });
        
        this.node.on('open_club_user_pwdSwitch',function(ret){
            cc.vv.popMgr.hide();
            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                return;
            }
            cc.vv.club._clubMember.getComponent('ClubMemberList').Change_switch({data:{pwdSwitch:1}});
        });
        //自己是否给上级玩家 上下分权限 默认值获取
        this.node.on('club_user_pwdSwitch',function(ret){
            cc.vv.popMgr.hide();
            if(!cc.vv.club._clubMember){
                return;
            }
            cc.vv.club._clubMember.getComponent('ClubMemberList').Change_switch(ret);
        });
        //获取自己的了口令
        this.node.on('club_master_ppwd',function(ret){
            if(!cc.vv.club._clubMember){
                return;
            }
            cc.vv.club._clubMember.getComponent('ClubMemberList').Set_mylkl(ret);
        });
        this.node.on('club_master_list',function(ret){ // 好友管理第一层
            cc.vv.popMgr.hide();
            var data = ret.data;
            
            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                return;
            }
            if(!cc.vv.club._clubMember){
                return;
            }
            cc.vv.club._clubMember.getComponent('ClubMemberList').getmasterlist(data.list);
        });
    
        //设置单人比例
        this.node.on('modify_junior_rate',function(ret){
            cc.vv.popMgr.hide();
            var data = ret.data;
            
            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                return;
            }
            cc.vv.popMgr.tip("修改成功！");
        });
        //绑定下级
        this.node.on('bind_junior',function(ret){
            cc.vv.popMgr.hide();
            var data = ret.data;
            
            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                return;
            }
            cc.vv.popMgr.tip(ret.data.msg);
            if(cc.vv.club._clubPwb){
                cc.vv.club._clubPwb.active = false
            }
            if(!cc.vv.club._clubMember || status){
                return;
            }
            cc.vv.club._clubMember.getComponent('ClubMemberList').onBtnleiXingXuanZe(null,"memberlist")
           
        });
         //绑定自己
         this.node.on('bind_own_junior',function(ret){
            cc.vv.popMgr.hide();
            
            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                return;
            }
            cc.vv.popMgr.tip(ret.data.msg);
           
        });
        //解绑下级
        this.node.on('un_bind_junior',function(ret){
            cc.vv.popMgr.hide();
            
            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                return;
            }
            cc.vv.club._clubPwb.active = false
            if(!cc.vv.club._clubMember){
                return;
            }
            cc.vv.club._clubMember.getComponent('ClubMemberList').onBtnleiXingXuanZe(null,"memberlist")
            cc.vv.popMgr.tip(ret.data.msg);
        });
        this.node.on('update_club_user_master',function(ret){
            cc.vv.popMgr.hide();
            var data = ret.data;
            
            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                return;
            }
            if(!cc.vv.club._clubMember){
                return;
            }
            cc.vv.userMgr.clubUsers[data.club_id][data.player_id].is_master = data.isMaster;
            cc.vv.userMgr.clubUsers[data.club_id][data.player_id].rate = data.rate;
          
            cc.vv.club._clubMember.getComponent('ClubMemberList').masterChanged(data.player_id);
            
        });
        //修改乐圈默认比例 的接收回调 
        this.node.on('club_rate_edit',function(ret){
            cc.vv.popMgr.hide();
            var data = ret.data;
            
            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                return;
            }
            cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].rate = data.rate;
            // cc.vv.userMgr.clubUsers[data.club_id][data.player_id].is_master = data.isMaster;
            // cc.vv.userMgr.clubUsers[data.club_id][data.player_id].rate = data.rate;
            
            // cc.vv.club._clubMember.getComponent('ClubMemberList').masterChanged(data.player_id);
        });
        //新增加的好友查询接口 
        this.node.on('club_friend_list',function(ret){
            cc.vv.popMgr.hide();
            var data = ret.data;
            
            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                return;
            }
            if(!cc.vv.club._clubMember){
                return;
            }
            cc.vv.club._clubMember.getComponent('ClubMemberList').getfriendlist(data.list);
        });
        // this.node.on('club_friend_user_list',function(ret){
        this.node.on('club_push_list',function(ret){
            cc.vv.popMgr.hide();
            var data = ret.data;
            
            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                return;
            }
            if(!cc.vv.club._clubMember){
                return;
            }
            cc.vv.club._clubMember.getComponent('ClubMemberList').getfriendlist(data.list);
        });

        this.node.on('club_friend_user_invite',function(ret){
            var data = ret.data;
            

            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                cc.vv.popMgr.hide();
                return;
            }
            cc.vv.popMgr.tip('邀请已发出,等待用户同意或拒绝');
        }),

        this.node.on('club_friend_user_invite_notice',function(ret){
            var data = ret.data;
            

            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                cc.vv.popMgr.hide();
                return;
            }
            cc.vv.popMgr.pop("club/ClubInviteNotice",function(obj){
                obj.getComponent('ClubInviteNotice').friend(data);
            });
        });

        this.node.on('friend_user_add_notice',function(ret){
            var data = ret.data;
            

            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                cc.vv.popMgr.hide();
                return;
            }
            if(!cc.vv.club._clubMember){
                return;
            }
            cc.vv.club._clubMember.getComponent('ClubMemberList').friendChanged(data);
        });

        this.node.on('club_user_master_plugs',function(ret){
            var data = ret.data;
            
            if(cc.vv.club.clubMain.active){
                cc.vv.club.clubMain.getComponent('ClubMain').show(data.club_id);
            }
        });

        this.node.on("club_info_plugs",function(ret){
            var data = ret.data;
            cc.vv.club.clubMain.getComponent('ClubMain').show(data.club_id);
        })

        this.node.on("club_user_status_change_plugs",function(ret){
            var data = ret.data;
            if(data.userStatus == -1){
                if(cc.vv.club._clubDetail){
                    cc.vv.club._clubDetail.active = false;
                }
                if(cc.vv.club._clubMember){
                    cc.vv.club._clubMember.active = false;
                }
                if(cc.vv.club._clubGameList){
                    cc.vv.club._clubGameList.active = false;
                }
                if(cc.vv.club._clubPwbList){
                    cc.vv.club._clubPwbList.active = false;
                }
                var node = cc.vv.utils.getChildByTag(cc.vv.club.clubMain.getChildByName('room'),data.clubid);
                if(node != null){
                    node.destroy();
                }
                cc.vv.userMgr.clubroom[data.clubid] = null;
            }else{
                cc.vv.net1.quick('club_info',{club_id:data.clubid});
            }
        })

        this.node.on("club_friend_user_add",function(ret){
            var data = ret.data;
            
            if(ret.errcode !== 0){
                cc.vv.popMgr.tip(ret.errmsg);
                cc.vv.popMgr.hide();
                return;
            }
            cc.vv.popMgr.tip("绑定好友成功");
            var node = cc.vv.club._clubMember.getComponent('ClubMemberList').getMaster(data.master_id);
            if(node != null){
                node.getComponent('ClubMaster').countAdd();
            }
        })
    },

    myclub:function(list){
        this.list.removeAllChildren();
        if(!list){
            return;
        }
        var objKeys = Object.keys(list);
        var key =  list[objKeys[0]];
        if(!key){
            this.clubList.active = false;
            return;
        }
        this.clubList.active = true;
        for(var i in list){
            var node = cc.instantiate(this.clubItem);
            node.myTag = list[i].club_id;
            this.list.addChild(node);
            node.x = 25;
            node.zIndex = list[i].myTag;
            node.getComponent('ClubItem').init(list[i]); 
        }
    },
    /**
     * 按钮处理
     */
    onBtnClicked:function(event){

        cc.vv.audioMgr.click();

        var self = this;
        switch(event.target.name){
            case "btn_club" :{
                if(JSON.stringify(cc.vv.userMgr.clublist) == '{}'){
                    cc.vv.popMgr.pop("ClubLayer");
                }else{
                    this.clubMain.active = true;
                    this.clubMain.getComponent('ClubMain').show(cc.vv.userMgr.club_id);
                }
            }
            break;
            case "group_btn_join":{
                cc.vv.popMgr.pop("club/JoinClub");
            }
            break;
            case "group_btn_create":{
                // if(cc.vv.userMgr.is_dealer==0){
                //     cc.vv.popMgr.tip('请联系客服申请开通乐圈');
                //     return;
                // }
                cc.vv.popMgr.pop("club/CreateClub");
            }
            break;
        }
    },
});
