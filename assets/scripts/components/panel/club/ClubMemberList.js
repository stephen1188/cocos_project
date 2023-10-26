cc.Class({
    extends: cc.Component,

    properties: {
        memberlist:cc.Node,
        statuslist:cc.Node,
        masterlist:cc.Node,
        friendlist:cc.Node,
        memberItem:cc.Prefab,
        memberstatus:cc.Prefab,
        masteritem:cc.Prefab,
        frienditem:cc.Prefab,
        textID:cc.EditBox,
        slefDealerID:cc.EditBox,
        memberlistview:cc.Node,
        onlinelistview:cc.Node,
        masterlistview:cc.Node,
        friendlistview:cc.Node,
        panels:cc.Node,
        toggles:cc.Node,
        textID_status:cc.EditBox,
        textID_master:cc.EditBox,
        textID_friend:cc.EditBox,
        friendBtns:cc.Node,
        friendToggle:cc.Node,
        memberlistToggle:cc.Node,
        memberstatusToggle:cc.Node,
        JF_help:cc.Node,
        JF_check:cc.Toggle,
        _idx:0,
        _data:null,
        _onlineidx:0,
        _onlineData:null,
        _masterData:null,
        flag:false,
        _clubeScheduleTime:0,
    },

    onLoad:function(){
        if(cc.winSize.width / cc.winSize.height - 16 / 9 > 0.1){ 
            var width = cc.winSize.width;
            this.node.width = width;
        }
        this.togg_times = 0
        var self = this;
        this.memberlistview.on('bounce-bottom',function(){
            // self.loadMember(18,self.textID.string);
        });

        this.onlinelistview.on('bounce-bottom',function(){
            // self.loadOnline(18,self.textID_status.string);
        });

        this.masterlistview.on('bounce-bottom',function(){
            // self.loadMaster(18,self.textID_master.string);
        });

        this.friendlistview.on('bounce-bottom',function(){
            // self.loadFriend(18,self.textID_friend.string);
        });

        this.ClubMemberJs = this.panels.getChildByName('memberlist').getComponent("ClubMember");
        this.ClubMemberStaJs = this.panels.getChildByName('memberstatus').getComponent("ClubMemberStaScroll");
        this.ClubMemberMasterAllJs = this.panels.getChildByName('friendmanage').getComponent("ClubMemberFriScroll");
        // 好友管理第一层
        this.ClubMemberMasterJs = cc.find("friendmanage/master",this.panels).getComponent("ClubMemberStaScroll");
        // 好友管理第二层
        this.ClubMemberFriendJs = cc.find("friendmanage/friend",this.panels).getComponent("ClubMember");
        
    },
    //
    Change_switch:function(ret){
        var self = this
        var data = ret.data;
        // cc.vv.userMgr.data
        self.is_checkedvalues = data.pwdSwitch
        self.JF_check.isChecked = self.is_checkedvalues
    },
    Set_mylkl:function(ret){
        var self = this
        var data = ret.data;
        var self = this
        self.my_lkl = data.ppwd
    },
    show:function(){
        var job = cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].job;
        var type = '';
        var self = this
        if(job == 0||job == 1){
            this.memberlistToggle.active = false;
            this.memberstatusToggle.active = false;
            type = this.toggles.children[2].name;
        }else{
            this.memberlistToggle.active = true;
            this.memberstatusToggle.active = true;
            type = this.toggles.children[0].name;
        }
        cc.vv.utils.setToggleChecked(this.toggles,type);
        this.onBtnleiXingXuanZe(null,type);
        if(job==9){
            this.JF_check.node.active = false
        }else{
            // self.JF_check.isChecked = self.is_checkedvalues
            this.JF_check.node.active = true
            cc.vv.net1.quick("club_user_pwdSwitch",{club_id:cc.vv.userMgr.club_id});
        }
        //获取自己的了口令
        cc.vv.net1.quick("club_master_ppwd",{club_id:cc.vv.userMgr.club_id});
    },
    //是否是点击开启上下分开关
    onclick_open(){
        if(this.JF_check.isChecked){
            cc.vv.net1.quick("update_club_user_pwdSwitch",{club_id:cc.vv.userMgr.club_id,pwdSwitch:0});
        }else{
            cc.vv.popMgr.alert("是否开启上下分开关？",function(){
                cc.vv.net1.quick("open_club_user_pwdSwitch_sendCode",{});
            },true);
        }
    },
    //上下分开关
    JF_switch:function(){
        var ls_switch = this.JF_check.isChecked ==0?0:1
        // cc.vv.popMgr.alert("是否确定要解散房间？",function(){
        //     self.sendRemove(0);
        // },true);
        cc.vv.net1.quick("update_club_user_pwdSwitch",{club_id:cc.vv.userMgr.club_id,pwdSwitch:ls_switch});
    },
    //积分说明提示
    JF_showhelp:function(){
        cc.vv.popMgr.hide();
        cc.vv.popMgr.alert("注意：开启积分操作您的上级将有权限扣除胜点！");
    },
    getMemberList:function(list){
        this.unschedule(this.ClubMemberTimeUpdate);
        this._data = list;
        this._idx = 0;
        this.ClubMemberJs.frameLoading(list);
    },

    
    //获取服务器消息倒计时
    ClubMemberTimeUpdate(){
        let self = this;
        this._clubeScheduleTime += 1;
        if(this._clubeScheduleTime >= 10){
            this.unschedule(this.ClubMemberTimeUpdate);
            cc.vv.popMgr.hide();
            cc.vv.popMgr.alert('网络异常，请重新登录',function(){
                self._clubeScheduleTime = 0;
                cc.game.restart();
            });
        }
    },
   
    getMember:function(userid){
        var node = cc.vv.utils.getChildByTag(this.memberlist,userid + "");
        if(node !== null) return node;
        return null;
    },

    removeUser:function(userid){
        var node = cc.vv.utils.getChildByTag(this.memberlist,userid + "");
        if(node !== null){
            node.destroy();
            delete cc.vv.userMgr.clubUsers[cc.vv.userMgr.club_id][userid];
        }
    },
    onBtnSertch:function(event){
        if(event.target.name=="1"){
           this.ReqSearchMember();
        }else if(event.target.name=="2"){
            this.ReqSearchOnline();
        }else if(event.target.name=="3"){
            this.ReqSearchFriend();
        }
    },
    ReqSearchMember(){ //成员管理搜索
        if(this.textID.string!=""){
            cc.vv.net1.quick("club_single_users",{club_id:cc.vv.userMgr.club_id,player_id:this.textID.string*1});
        }else{
            cc.vv.popMgr.wait('正在获取成员列表',function(){
                cc.vv.net1.quick("club_users",{club_id:cc.vv.userMgr.club_id,type:0});
            });
        }
    },
    ReqSearchOnline(){ // 成员状态搜索
        if(this.textID_status.string!=""){
            cc.vv.net1.quick("club_single_user_online_list",{club_id:cc.vv.userMgr.club_id,player_id:this.textID_status.string});
        }else{
            cc.vv.popMgr.wait('正在获取成员状态',function(){
                cc.vv.net1.quick("club_user_online_list",{club_id:cc.vv.userMgr.club_id,check_list:[]});
            });
        }
    },
    ReqSearchFriend(){ // 好友管理第一层搜索
        if(this.textID_master.string!=""){
            cc.vv.net1.quick("club_single_master_list",{club_id:cc.vv.userMgr.club_id,player_id:this.textID_master.string});
        }else{
            var job = cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].job;
            cc.vv.popMgr.wait('正在获取好友列表',function(){
                if(job == 9){
                    cc.vv.net1.quick("club_master_list",{club_id:cc.vv.userMgr.club_id});
                }else{
                    cc.vv.net1.quick("club_friend_list",{club_id:cc.vv.userMgr.club_id});
                }
            });
        }
    },
    onEditChanged:function(event){
        this.ReqSearchMember();
    },

    onEditChanged2:function(event){
        this.ReqSearchOnline();
    },

    onEditChanged3:function(event){
        this.ReqSearchFriend();
    },

    onEditChanged4:function(event){
        this.search4(event);
    },

    onEditEnd:function(event){
        this.ReqSearchMember();
    },

    onEditEnd2:function(event){
        this.ReqSearchOnline();
    },

    onEditEnd3:function(event){
        this.ReqSearchFriend();
    },

    search:function(text){
    },

    search2:function(text){
    },

    search3:function(text){
        // let list = [];
        // for(let i in this._masterData){
        //     let userid = this._masterData[i].user_id +"";
        //     if(userid.indexOf(text) == 0){
        //         list.push(this._masterData[i]);
        //     }
        // }
        // this.ClubMemberMasterJs.frameLoading(list,true,'master')
    },

    search4:function(text){
        let list = [];
        for(let i in this._friendData){
            let userid = this._friendData[i].user_id +"";
            if(userid.indexOf(text) == 0){
                list.push(this._friendData[i]);
            }
        }
        this.ClubMemberFriendJs.frameLoading(list,true,'friend');
    },

    editdel:function(event){
        this.textID.string = '';
        this.ReqSearchMember();
    },

    editdel2:function(event){
        this.textID_status.string = '';
        this.ReqSearchOnline();
    },

    editdel3:function(event){
        this.textID_master.string = '';
        this.ReqSearchFriend();
    },

    editdel4:function(event){
        this.textID_friend.string = '';
        this.ClubMemberFriendJs.frameLoading(this._friendData,true,'friend');
    },

    resetEdoit:function(){
        this.textID.string = '';
        this.textID_status.string = '';
        this.textID_master.string = '';
        this.textID_friend.string = '';
    },

    // 成员状态
    getOnlineList:function(list){
        this._onlineData = list;
        this._onlineidx = 0;
        this.ClubMemberStaJs.frameLoading(list)
    },


    // 好友管理
    getmasterlist:function(list){
        this._masterData = list;
        var node = this.panels.getChildByName('friendmanage');    
        node.getChildByName('zhijie').getComponent(cc.Label).string = list.length
        let a = 0
        for(let i = 0;i<list.length;i++){
            a+= parseInt(list[i].count)
        }
        node.getChildByName('jianjie').getComponent(cc.Label).string = a
        this.ClubMemberMasterAllJs.isShow(true);
        this.ClubMemberMasterJs.frameLoading(list,false,'master')
    },


    getMaster:function(id){
        var node = cc.vv.utils.getChildByTag(this.masterlist,id+"");
        return node;
    },

    masterChanged:function(playerid){ //update_club_user_master
        var data = cc.vv.userMgr.clubUsers[cc.vv.userMgr.club_id][playerid];
        var node =  cc.vv.utils.getChildByTag(this.masterlist,playerid+"");
        if(node == null){
            // var node = cc.instantiate(this.masteritem);
            // node.myTag = playerid + "";
            // this.masterlist.addChild(node);
            // for(var i = 0; i < this.masterlist.childrenCount; i++){
            //     this.masterlist.children[i].zIndex = i+1;
            // }
            // node.zIndex = 0;
            // let masterjs = node.getComponent("ClubMaster");
            // if(masterjs){
            //     masterjs.init({headimg:data.headimg,name:data.name,user_id:playerid,count:0,rate:data.rate});
            // }
          
            // this.masterlistview.getComponent(cc.ScrollView).scrollToTop(0);
            let masterNode = cc.find("friendmanage/master",this.panels) //点开状态加入
            if(!masterNode.active){
                return;
            }
            data.user_id = playerid;
            if(this._masterData == null){
                this._masterData = [];
                this._masterData.push(data);
            }else{
                this._masterData.push(data);
            }
            this.ClubMemberMasterJs.frameLoading(this._masterData,false,'master')
            return;
        }
        let masjs = node.getComponent("ClubMaster");
        if(masjs){
            masjs.init({headimg:data.headimg,name:data.name,user_id:playerid,rate:data.rate});
        }
    },

    // 好友管理第二层
    getfriendlist:function(list){
        var node = this.panels.getChildByName('friendmanage');    
        this._friendData = list;

        this.ClubMemberMasterJs.updateMasterFlag(false);
        this.ClubMemberMasterAllJs.isShow(false);
        this.ClubMemberFriendJs.frameLoading(list,false,'friend');
        node.getChildByName('zhijie').getComponent(cc.Label).string = list.length
        var a = 0
        for(let i = 0;i<list.length;i++){
            a+=parseInt(list[i].fcode)
        }
        node.getChildByName('jianjie').getComponent(cc.Label).string = a
        if(cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].job == 9){
            this.friendBtns.active = false;
            node.getChildByName('friend').getChildByName('btn_backmaster').active = true;
        }
        if(list.length == 0){
            node.getChildByName('friend').getChildByName('bg').active = true;
        }else{
            node.getChildByName('friend').getChildByName('bg').active = false;
        }
        cc.vv.popMgr.hide();
    },

    friendChanged:function(data){ // friend_user_add_notice
        var friendNode = cc.find("friendmanage/friend",this.panels);
        if(!friendNode.active){
            return;
        }
        var node = cc.vv.utils.getChildByTag(this.friendlist,data.user_id+"");
        if(node == null){
            if(this._friendData == null){
                this._friendData = [];
                this._friendData.push(data);
            }else{
                this._friendData.push(data);
            }
            this.ClubMemberFriendJs.frameLoading(this._friendData,false,'friend');
        }
    },
   
    getFriend:function(id){
        var node = cc.vv.utils.getChildByTag(this.friendlist,id + "");
        if(node !== null) return node;
        return null;
    },
    onBtnleiXingXuanZe:function(event,detail){
        let self = this;
        if(this.togg_times>0)return
        this.togg_times = 1
        this.node.runAction(cc.sequence(
            cc.delayTime(0.2),
            cc.callFunc(function(){
                self.togg_times = 0
            })))
        if(event != null){
            cc.vv.audioMgr.click();
        }
        if(detail == null)detail = event.target.name;
        for(var i = 0; i < this.panels.children.length; ++i){
            var name = this.panels.children[i].name;
            this.panels.children[i].active = (detail == name);
        }
        this.resetEdoit();
        switch(detail){
            case 'memberlist':{
                cc.vv.popMgr.wait('正在获取成员列表',function(){
                    self.schedule(self.ClubMemberTimeUpdate,1);
                    cc.vv.net1.quick("club_users",{club_id:cc.vv.userMgr.club_id,type:0});
                });
            }
            break;
            case 'memberstatus':{
                cc.vv.popMgr.wait('正在获取成员状态',function(){
                    cc.vv.net1.quick("club_user_online_list",{club_id:cc.vv.userMgr.club_id,check_list:[]});
                });
            }
            break;
            case 'friendmanage':{
                var job = cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].job;
                cc.vv.popMgr.wait('正在获取好友列表',function(){
                    if(job == 9){
                        cc.vv.net1.quick("club_master_list",{club_id:cc.vv.userMgr.club_id});
                    }else{
                        cc.vv.net1.quick("club_friend_list",{club_id:cc.vv.userMgr.club_id});
                    }
                });
            }
            break;
        }
    },

    share:function(url){
        var platform = parseInt(1);
        var title = "我是" + cc.vv.userMgr.userName + ",来和我一起切磋吧";
        var text = "点击该链接进入游戏发送入群申请,我在这里等你!";
        //var url = 'https://www.jappstore.com/jalegam';
        var imgurl = jsb.fileUtils.fullPathForFilename('res/raw-assets/resources/public/dairy_icon.png');
        cc.vv.g3Plugin.shareWeb(platform,title,text,imgurl,url,function(code,msg){
        });
    },

    onBtnClicked:function(event){
        var self = this;
        switch(event.target.name){
            case 'btn_addmaster':{
                // cc.vv.popMgr.pop('club/NoMaterUsersList',function(obj){
                //     obj.getComponent('NoMaterUsersList').init();
                // });
                //  绑定下级玩家
                self.slefDealerID.string="";
                this.ClubMemberMasterAllJs.isShowSelfDlr(true);
            }
            break;
            case "close_selfdlr":{
                this.ClubMemberMasterAllJs.isShowSelfDlr(false);
            }
            break;
            case "btn_selfbind_junior":{
                if(self.slefDealerID.string ==""){
                    cc.vv.popMgr.tip("请输入正确的id");
                }else{
                    cc.vv.net1.quick("bind_own_junior",{club_id:cc.vv.userMgr.club_id,junior_id:self.slefDealerID.string});
                }
            }break;
            //分享乐口令出去
            case "btn_lkl":{
                cc.vv.g3Plugin.shareText(1,"复制乐口令","点击复制乐口令绑定上级："+self.my_lkl);
            }break;
            case 'btn_tjxq':
            case 'btn_xqtj':{
                // cc.vv.net1.quick("club_reward_list",{club_id:cc.vv.userMgr.club_id,player_id:cc.vv.userMgr.userid});
                var tid = Date.parse(new Date());
                var uid = cc.vv.userMgr.userid.toString();
                var cid = cc.vv.userMgr.club_id.toString();
                // for(var i = 0; i < 20 - cc.vv.userMgr.userid.toString().length; i++){
                //     uid += '0';
                // }
                // for(var i = 0; i < 20 - cc.vv.userMgr.club_id.toString().length; i++){
                //     cid += '0';
                // }
                var session = cc.vv.utils.md5(cid+uid+cc.GAME_CODE+tid);
                var url =cc.GAMEMEMBER+ 'client?m=clubMasterCount&code='+cc.GAME_CODE+'&cid='+cc.vv.userMgr.club_id+
                '&uid='+ cc.vv.userMgr.userid+'&session='+session+'&tid='+tid;
                cc.sys.openURL(url);
            }
            break;
            case 'btn_invitefriend':{
                cc.vv.g3Plugin.shareText(1,"复制乐口令","点击复制乐口令绑定上级："+self.my_lkl);
                // var job = cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].job;
                // var is_master = cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].is_master;
                // if(is_master == 0 && job != 9){
                //     cc.vv.popMgr.tip("请先联系圈主开通邀请好友权限");
                //     return;
                // }
                // // cc.vv.popMgr.pop("club/ClubInvite",function(obj){
                // //     obj.getComponent('JoinClub').setInviteType('club_friend_user_invite');
                // // });
                // var dealer = cc.vv.userMgr.userid.toString();
                // var clubid = cc.vv.userMgr.club_id.toString();
                // for(var i = 0; i < 20 - cc.vv.userMgr.userid.toString().length; i++){
                //     dealer += '0';
                // }
                // for(var i = 0; i < 20 - cc.vv.userMgr.club_id.toString().length; i++){
                //     clubid += '0';
                // }
                // var session = cc.vv.utils.md5(dealer+clubid+cc.GAME_CODE);
                // // var url = 'http://friend.ccplays.com/api/share?code='+cc.GAME_CODE+'&dealer='+cc.vv.userMgr.userid+
                // // '&clubid='+cc.vv.userMgr.club_id+'&session='+session;
                // //修改邀请链接到公众号
                // var uid = cc.vv.userMgr.userid.toString();
                // var cid = cc.vv.userMgr.club_id.toString();
                // var session1 = cc.vv.utils.md5(cid+uid+"lmj");
                // var url = "http://game.8l8s0.cn:8010/mgr/friend?code=lmj&cid="+cid+"&uid="+uid+"&session="+session1;
                // this.share(url);
            }
            break;
            case 'btn_rateview':{
                if(cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].is_master == 1){
                    var rate = cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].rate;
                    cc.vv.popMgr.pop('club/ClubRateTable',function(obj){
                        obj.getComponent('ClubRateTable').show(rate);
                    });
                }
            }
            break;
            case 'btn_fzkl':{
                cc.vv.g3Plugin.copyText(self.my_lkl);
                cc.vv.popMgr.alert("复制口令"+self.my_lkl+"成功，可以去微信分享了");
            }
            break;
        }
    },

    onClickBack(){
        cc.vv.memberBack = false;
        cc.vv.club._clubMember = null;
        this.node.destroy();
        
        if(cc.vv.club.clubMain){
            cc.vv.club.clubMain.active = true;
        }
        this.unschedule(this.ClubMemberTimeUpdate);
    }
    // update (dt) {},
});
