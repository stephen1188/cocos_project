cc.Class({
    extends: cc.Component,

    properties: {
        _job:0,
        club_id:cc.Label,
        club_name:cc.Label,
        // club_desc:cc.Label,
        lblPwb:cc.Label,
        clublist:cc.Node,
        identify:cc.Node,
        head:cc.Node,
        ticket:cc.Label,

        clubitem:cc.Prefab,
        menu:cc.Node,

        statusAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        newmark:cc.Node,
        _notice:0,

        btn_message:cc.Button,
        btn_member:cc.Button,
        btn_set:cc.Button,
        btn_pwb:cc.Node,
        btn_roomset:cc.Node,
        btn_createroom:cc.Node,
        btn_roomset2:cc.Node,
        btn_createroom2:cc.Node,
        nodeGuolv:cc.Node,
        guolvlist:cc.Node,
        allclub:cc.Node,
        club_cur:cc.Node,
        club_cur2:cc.Node,
        clubinfo:cc.Label,
        // allgameToggle:cc.Toggle,
        clubScrollList: cc.Node,
        update_times:0,
        _repeatID:0,
        is_frist:true,
        toggleArr: [cc.Toggle],
        toggleAll:cc.Toggle,
    },

    onLoad:function(){
        if(cc.winSize.width / cc.winSize.height - 16 / 9 > 0.1){ 
            
            var width = cc.winSize.width;
            this.node.width = width;
            // this.btn_roomset2.active = false;
            // this.btn_createroom2.active = false;
        }else{
            // this.btn_roomset.active = false;
            // this.btn_createroom.active = false;
        }

        cc.vv.userMgr.roomlist = {
            "tdh_1600":1,
            "kd_1700":2,
            "gsj_2500":3,
            "kd_1702":4,
            "ddz_1800":5,
            "ddz_1801":5,
            "ddz_1803":5,
            "ddz":5,
            "nn_1000":6,
            "nn_1001":6,
            "nn_1002":6,
            "nn_1003":6,
            "nn":6,
            "ysz_2300":7,
            "tjd_1300":8,
            "tjd_1301":8,
            "tjd":8,
            "ttz_1400":8,
            "ttz_1401":8,
            "ttz_1402":8,
            "zpj_2800":8,
            "pdk_1900":9,
            "dq_2700":10,
            "hs_3100":11,
            "zgz_3300":12,
        }

        //监听
        this.node.on('room',function(){
            cc.vv.log3.info("切换圈子")
            var get = {
                method:"club_room_list",
                data:{
                    club_id:cc.vv.userMgr.club_id
                }
            };
            cc.vv.net1.send(get);
        });
        let clubRoomList = this.clubScrollList.getComponent("ClubRoomList");
        this.node.on('club_room_list',function(data){
            clubRoomList.OpenedRoomList(data.type);
            // clubRoomList.OpenedRoomList(1,this.isCheckedFlag);
        });

        this.node.on('club_room',function(data){
            clubRoomList.OpenedRoomChange(data);
        });

        this.node.on('club_room_del',function(data){
            clubRoomList.OpenedRoomRemove(data);
        });
    },

    start:function(){
        this.nodeGuolv.active = false;
        this.allclub.active = false;
    },

    onDisable:function(){
        cc.vv.net1.quick("club_exit",{});
    },

    onEnable:function(){
        if(cc.vv.userMgr.club_id&&!this.is_frist){
            cc.vv.net1.quick('club_room_list',{club_id:cc.vv.userMgr.club_id})
        };
        this.is_frist = false
        var self = this
        this.allclub.active = false;
        if(cc.vv.memberBack){
            cc.vv.utils.popPanel(this.node);
        }
        cc.vv.memberBack = true
        // this.node.removeAllAction()
        this.node.runAction(cc.sequence(
            cc.delayTime(720),
            cc.callFunc(function(){
                var room =  cc.vv.utils.getChildByTag(self.node.getChildByName("room"),cc.vv.userMgr.club_id);
                if(room != null){
                    var content = room.getComponent(cc.ScrollView).content;
                    for(var i = 0; i < content.childrenCount; i++){
                        var node = content.children[i];
                        if(node.name == "ClubRuleTip"){
                            node.removeFromParent();
                        }
                    }
                }
                cc.vv.userMgr.clubRoomEnter = 0;
                //cc.vv.userMgr.club_id = 0;
                cc.vv.hall.move_in = false;
                self.node.active = false
            })))
    },
    close_allclublist:function(){
        this.allclub.active = false
    },
    get_first:function(){
        if(JSON.stringify(cc.vv.userMgr.clublist) == '{}')return null;
        var objKeys = Object.keys(cc.vv.userMgr.clublist);
        return cc.vv.userMgr.clublist[objKeys[0]];
    },

    show:function(clubid,spr){
        // cc.log('clubid =', clubid);
        // cc.log('spr =', spr);
        cc.vv.popMgr.hide();
        cc.vv.club.users = 0;
        if(clubid!=0){cc.vv.net1.quick('club_room_list',{club_id:clubid})};
        if(clubid == 0){
            if(cc.vv.userMgr.clublist2.length == 0){
                this.node.active = false;
                cc.vv.hall.move_in = false;
                return;
            }
            clubid = cc.vv.userMgr.clublist2[0].club_id;
            cc.vv.userMgr.club_id = clubid;
        }
        
        var data = cc.vv.userMgr.clublist[clubid];
        if(data == null){
            if(cc.vv.userMgr.clublist2.length == 0){
                this.node.active = false;
                cc.vv.hall.move_in = false;
                return;
            }
            clubid = cc.vv.userMgr.clublist2[0].club_id;
            cc.vv.userMgr.club_id = clubid;
            data = cc.vv.userMgr.clublist[clubid];
        }

        //默认显示全部游戏房间
        this.initRoomType();

        //刷新房间列表
        if(cc.vv.userMgr.clublist[clubid]){
            if(cc.vv.userMgr.clublist[clubid].userStatus == 1){
                if(cc.vv.userMgr.clubroom == null || cc.vv.userMgr.clubroom[clubid] == null){
                    this.node.emit('room');
                }else{
                    this.node.emit('club_room_list',{type:0});
                }
            }
        }

        this.initlist();
        this.menu.active = false;

        var curhead = this.club_cur.getChildByName('head').getChildByName('img');
        var curname = this.club_cur.getChildByName('mask').getChildByName('name');
        if(spr){ 
            this.head.getComponent(cc.Sprite).spriteFrame = spr;
            curhead.getComponent(cc.Sprite).spriteFrame = spr;
        }else{
            this.head.getComponent("ImageLoader").loadImg(data.creator_headimg);
            curhead.getComponent("ImageLoader").loadImg(data.creator_headimg);
        }
        curname.getComponent(cc.Label).string = data.name;
        this.club_id.string = 'ID:' + data.clubno;
        this.club_name.string = data.name;
        this.clubinfo.node.stopAllActions();
        this.clubinfo.node.x = 0;
        this.clubinfo.string = data.desc.replace(/[\r\n]/g,"");
        curname.stopAllActions();
        if(curname.width > 242){
            var move = (curname.width - 242) / 2;
            curname.runAction(
                cc.repeatForever(
                    cc.sequence(cc.delayTime(1.0),cc.moveTo(2.0,cc.v2(move,curname.y)),cc.delayTime(1.0),cc.moveTo(2.0,cc.v2(-move,curname.y)))
                )
            );
        }
        //this.club_desc.string = data.desc;
        this.lblPwb.string = cc.vv.utils.numFormat(data.pwb);
        this._job = data.job;
        if(this._job == 9){
            this.ticket.string = cc.vv.userMgr.ticket;
        }
        else{
            this.ticket.string = data.ticket >= 300 ? '充足' : '紧张';
        }
        var identify = '';
        var sf = null;
        if(data.job == 9){
            identify = '圈主';
            sf = this.statusAtlas.getSpriteFrame('identifybg0');
        }
        else if(data.job == 0){
            identify = '成员';
            sf = this.statusAtlas.getSpriteFrame('identifybg1');
        }
        else{
            identify = '管理员';
            sf = this.statusAtlas.getSpriteFrame('identifybg0');
        }
        this.identify.getComponent(cc.Sprite).spriteFrame = sf;
        var name = this.identify.getChildByName('name');
        name.getComponent(cc.Label).string = identify;
        this.identify.width = name.width + 10;

        if(data.job > 0){
            this.btn_message.interactable = true;
            // this.btn_message.node.getComponent(cc.Sprite).spriteFrame = this.statusAtlas.getSpriteFrame('btn_normal_message');
        }else{
            this.btn_message.interactable = false;
            // this.btn_message.node.getComponent(cc.Sprite).spriteFrame = this.statusAtlas.getSpriteFrame('btn_gray_message');
        }

        if(data.job >= 2){
            this.btn_set.interactable = true;
            // this.btn_set.node.getComponent(cc.Sprite).spriteFrame = this.statusAtlas.getSpriteFrame('btn_normal_set');
        }else{
            this.btn_set.interactable = false;
            // this.btn_set.node.getComponent(cc.Sprite).spriteFrame = this.statusAtlas.getSpriteFrame('btn_gray_set');
        }

        this.btn_roomset.active = data.job >= 2;

        this.newmark.active = false;
    
        cc.vv.club.clubNotice == 0;
        if(this._job > 0){
            cc.vv.net1.quick("club_joins",{club_id:cc.vv.userMgr.club_id});
        }
        // if(cc.vv.club._clubMember){
        //     cc.vv.club._clubMember.active = false;
        // }
    },

    refresh:function(data){
        if(data.userid == cc.vv.userMgr.userid){
            this.lblPwb.string = cc.vv.utils.numFormat(data.pwb);
            cc.vv.userMgr.clublist[data.clubid].pwb = this.lblPwb.string;
        }
        else{
            this.lblPwb.string = (parseFloat(this.lblPwb.string) + parseFloat(cc.vv.utils.numFormat(data.changePwb))).toFixed(1);
            cc.vv.userMgr.clublist[data.clubid].pwb = this.lblPwb.string;
        }
    },

    newPwb:function(data){
        this.lblPwb.string = data.pwb;
        if(this._job == 9){
            this.ticket.string = data.ticket;
        }
        else{
            this.ticket.string = data.ticket >= 300 ? '充足' : '紧张';
        }
    },

    clubNotice:function(list){
        if(list.length > 0 && this._job > 0){
            this.newmark.active = true;
            this.newmark.getComponentInChildren(cc.Label).string = list.length;
        }else{
            this.newmark.active = false;
        }
        if(list.length == 0){
            cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].notice = 0;
            cc.vv.gameClubMgr.clubNotify = [];
        }
    },

    initlist:function(){
        var data = cc.vv.userMgr.clublist[cc.vv.userMgr.club_id];
        // cc.log('data = ', data);
        var head = this.club_cur2.getChildByName('head').getChildByName('img');
        var name = this.club_cur2.getChildByName('mask').getChildByName('name');
        head.getComponent("ImageLoader").loadImg(data.creator_headimg);
        name.getComponent(cc.Label).string = data.name;
        name.stopAllActions();
        if(name.width > 196){
            var move = (name.width - 196) / 2;
            name.runAction(
                cc.repeatForever(
                    cc.sequence(cc.delayTime(1.0),cc.moveTo(2.0,cc.v2(move,name.y)),cc.delayTime(1.0),cc.moveTo(2.0,cc.v2(-move,name.y)))
                )
            );
        }
        for(var i in cc.vv.userMgr.clublist){
            if(cc.vv.userMgr.clublist[i].status == -1) continue;
            var node = cc.vv.utils.getChildByTag(this.clublist,cc.vv.userMgr.clublist[i].club_id);
            if(node == null){
                node = cc.instantiate(this.clubitem);
                node.myTag = cc.vv.userMgr.clublist[i].club_id;
                node.zIndex = cc.vv.userMgr.clublist[i].myTag;
                this.clublist.addChild(node);
            }
            if(cc.vv.userMgr.clublist[i].club_id === cc.vv.userMgr.club_id){
                node.getChildByName('mask').getChildByName('name').color = new cc.Color(206,78,0);
                // node.getChildByName('mask').getChildByName('name').getComponent(cc.LabelOutline).enabled = true;
                // node.getChildByName('mask').getChildByName('name').getComponent(cc.LabelOutline).color = new cc.Color(206,78,0);
                // node.getChildByName('mask').getChildByName('name').getComponent(cc.LabelOutline).width = 2;
            }
            else{
                node.getChildByName('mask').getChildByName('name').color = new cc.Color(1,91,171);
                // node.getChildByName('mask').getChildByName('name').getComponent(cc.LabelOutline).enabled = false;
            }
            node.getComponent('ClubItem').init(cc.vv.userMgr.clublist[i]);
        }
    },

    removeClub:function(clubid){
        var node = cc.vv.utils.getChildByTag(this.clublist,clubid);
        if(node != null){
            node.destroy();
        }
    },

    removeAllClub:function(){
        this.clublist.removeAllChildren();
    },
    removeRoomAllClub(){
        this.clubScrollList.removeAllChildren();
    },
    onClicked:function(event){
        cc.vv.audioMgr.click();
        switch(event.target.name){
            case 'clublist_shadow':{
                this.allclub.active = false;
            }
            break;
            case 'club_cur':
            case 'btn_xiala':{
                this.allclub.active = true;
            }
            break;
            case 'btn_detail':{
                if(cc.vv.club._clubDetail == null){
                    cc.vv.popMgr.pop('club/ClubDetail',function(obj){
                        cc.vv.club._clubDetail = obj;
                        obj.getComponent('ClubDetail').show(cc.vv.userMgr.club_id);
                    });
                }
                else{
                    cc.vv.club._clubDetail.active = true;
                    cc.vv.club._clubDetail.getComponent('ClubDetail').show(cc.vv.userMgr.club_id);
                }
            }
            break;
        }
    },

    onBtnClicked:function(event){
        cc.vv.audioMgr.click();
        var self = this;
        if(event.target.name != "btn_back"){
            if(cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].userStatus == -1){
                cc.vv.popMgr.alert('你无法在该乐圈游戏');
                return;
            }
        }
        var room = cc.vv.utils.getChildByTag(this.node.getChildByName("room"),cc.vv.userMgr.club_id);
        if(room != null){
            var content = room.getComponent(cc.ScrollView).content;
            for(var i = 0; i < content.childrenCount; i++){
                var node = content.children[i];
                if(node.name == "ClubRuleTip"){
                    node.removeFromParent();
                }
            }
        }
        switch(event.target.name){
            case 'btn_member':{
                cc.vv.club.users = 1;
                if( cc.vv.club._clubMember === null){
                    cc.vv.popMgr.pop('club/ClubMemberList',function(obj){
                        cc.vv.club._clubMember = obj;
                        obj.getComponent('ClubMemberList').show();
                        if(cc.vv.club.clubMain){
                            cc.vv.club.clubMain.active = false;
                        }
                    });
                }else{
                    cc.vv.club._clubMember.active = true;
                    cc.vv.club._clubMember.getComponent('ClubMemberList').show();
                    if(cc.vv.club.clubMain){
                        cc.vv.club.clubMain.active = false;
                    }
                   
                }
                
            }
            break;
            case 'btn_pwb':{
                var player_id = this._job >= 2 ? 0 : cc.vv.userMgr.userid;
                cc.vv.popMgr.wait('正在查看所有成员胜点清单',function(){
                    cc.vv.net1.quick("club_pwb_list",{club_id:cc.vv.userMgr.club_id,player_id:player_id,type:0});
                });
            }
            break;
            case 'btn_message':{
                cc.vv.club.clubNotice = 1;
                if( cc.vv.club._clubMsg === null){
                    cc.vv.popMgr.pop('club/ClubMessage',function(obj){
                        cc.vv.club._clubMsg = obj;
                        obj.getComponent('ClubMessage').show();
                    });
                }
                else{
                    cc.vv.club._clubMsg.active = true;
                    cc.vv.club._clubMsg.getComponent('ClubMessage').show();
                }
            }
            break;
            // case 'btn_detail':{
            //     if(cc.vv.club._clubDetail == null){
            //         cc.vv.popMgr.pop('club/ClubDetail',function(obj){
            //             cc.vv.club._clubDetail = obj;
            //             obj.getComponent('ClubDetail').show(cc.vv.userMgr.club_id);
            //         });
            //     }
            //     else{
            //         cc.vv.club._clubDetail.active = true;
            //         cc.vv.club._clubDetail.getComponent('ClubDetail').show(cc.vv.userMgr.club_id);
            //     }
            // }
            // break;
            case 'btn_set':{
                if(cc.vv.club._clubSet == null){
                    cc.vv.popMgr.pop('club/ClubSetting',function(obj){
                        cc.vv.club._clubSet = obj;
                        obj.getComponent('ClubSetting').show();
                    });
                }else{
                    cc.vv.club._clubSet.active = true;
                    cc.vv.club._clubSet.getComponent('ClubSetting').show();
                }
                if(cc.vv.club.clubMain){
                    cc.vv.club.clubMain.active = false;
                }
            }
            break;
            case "btn_zixuankaizhuo":{
                //自选抢房
                cc.vv.hall.create_room = 1;
                cc.vv.hall.winCreate.active = true;
                cc.vv.hall.winCreate.emit("show");
            }
            break;
            case "btn_morenputongzhuo":{
                var ptz = cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].ptz;
                var id = 0;
                if( ptz.length > 0){
                    id = ptz[0].id;
                }  
                var club_room_create = {
                    method:"club_room_create",
                    data:{
                        version:cc.SERVER,
                        club_id:cc.vv.userMgr.club_id,
                        model:2,
                        id:id
                    }
                };

                cc.vv.popMgr.wait("正在创建房间",function(){
                    cc.vv.net1.send(club_room_create);
                });
            }
            break;
            case "btn_morenpaiweisai":{  
                var pwz = cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].pwz;
                if(pwz.length == 0){
                    cc.vv.popMgr.tip('没有设置排位桌规则');
                    return;
                }
                if(pwz.length == 1){
                    var id = pwz[0].id;
                     var club_room_create = {
                        method:"club_room_create",
                        data:{
                            version:cc.SERVER,
                            club_id:cc.vv.userMgr.club_id,
                            model:3,
                            id:id
                        }
                    };
                    cc.vv.popMgr.wait("正在创建房间",function(){
                        cc.vv.net1.send(club_room_create);
                    });
                }
                else{
                    cc.vv.popMgr.pop('club/ClubRuleSelect',function(obj){
                        obj.getComponent('ClubRuleSelect').show(pwz);
                    });
                }
                //亲友圈 默认晋级赛开房
            }
            break;
            case 'btn_add':{
                this.menu.active = true;
                this.menu.zIndex = 100;
            }
            break;
            case 'menushadow':{
                this.menu.active = false;
            }
            break;
            case 'btn_createclub':{
                if(cc.vv.userMgr.is_dealer==0){
                    cc.vv.popMgr.tip('请联系客服申请开通乐圈');
                    return;
                }
                cc.vv.popMgr.pop("club/CreateClub");
                this.menu.active = false;
            }
            break;
            case 'btn_joinclub':{
                cc.vv.popMgr.pop("club/JoinClub");
                this.menu.active = false;
            }
            break;
            case 'btn_back':{
                cc.vv.userMgr.clubRoomEnter = 0;
                //cc.vv.userMgr.club_id = 0;
                cc.vv.hall.move_in = false;
                this.removeRoomAllClub();
            }
            break;
            case 'btn_roomset2':
            case 'btn_roomset':{
                if(cc.vv.club._clubSetRule == null){
                    cc.vv.popMgr.pop('club/ClubSetRule',function(obj){
                        cc.vv.club._clubSetRule = obj;
                        obj.getComponent('ClubSetRule').show();
                    });
                }
                else{
                    cc.vv.club._clubSetRule.active = true;
                    cc.vv.club._clubSetRule.getComponent('ClubSetRule').show();
                }
            }
            break;
            case 'btn_creatroom2':
            case 'btn_createroom':{
                if(cc.vv.club._clubGameList == null){
                    cc.vv.popMgr.pop('club/ClubGameList',function(obj){
                        cc.vv.club._clubGameList = obj;
                        obj.getComponent('ClubGameList').show();
                    });
                }
                else{
                    
                    cc.vv.club._clubGameList.active = true;
                    cc.vv.club._clubGameList.getComponent('ClubGameList').show();
                }
            }
            break;
            case "btn_refresh":{
                cc.vv.net1.quick('club_room_list',{club_id:cc.vv.userMgr.club_id})
                // var node = cc.vv.club.clubMain.getChildByName('room').getChildByTag(cc.vv.userMgr.club_id);
                // if(node != null){
                //     node.destroy();
                // }
                // cc.vv.userMgr.clubroom[cc.vv.userMgr.club_id] = null;
                // cc.vv.popMgr.wait("正在刷新房间列表",function(){
                //     cc.vv.net1.quick("club_info",{club_id:cc.vv.userMgr.club_id});
                // });
            }
            break;
            case "btn_guolv":{
                // this.refreshSelect();
                this.setSelect();
                this.nodeGuolv.active = true;
            }
            break;
            case 'guolv_shadow':{
                this.nodeGuolv.active = false;
            }
            break;
            // case 'clublist_shadow':{
            //     this.allclub.active = false;
            // }
            // break;
            // case 'club_cur':
            // case 'btn_xiala':{
            //     this.allclub.active = true;
            // }
            // break;
            default:{
                cc.vv.popMgr.tip("敬请期待");
            }
        }
    },

    refreshRoom:function(){
        if(cc.vv.userMgr.clubroom == null || cc.vv.userMgr.clubroom[cc.vv.userMgr.club_id] == null){
            this.node.emit('room');
        }else{
            this.node.emit('club_room_list',{type:0});
        }
    },

    getGameType:function(){
        
    },

    initRoomType:function(){
        var roomtype = cc.sys.localStorage.getItem(cc.vv.userMgr.club_id+"roomtype");
        cc.log('roomtype =', roomtype);
        if(roomtype == null || roomtype == ""){
            cc.vv.userMgr.selectroom = [];
        }else{
            cc.vv.userMgr.selectroom = [];
            let list = roomtype;

            // var list = roomtype.split(' ');
            // cc.log(" list = ", list);
            // 兼容 下一版可删
            // if(list.length>2){ 
            //     list=[8];
            // }
            cc.log('list = ', list);
            list.split(',').forEach(element => {
                console.log('0000000000000000000000', element)
                cc.vv.userMgr.selectroom.push(element);
            });
            if (list.split(',').length == 12) {
                this.toggleAll.isChecked = true;
            }
            // for(var i = 0; i < list.length; i++){
            //     if(list[i] != " " && list[i] != "" && list[i] != ","){
            //         cc.vv.userMgr.selectroom.push(list[i]);
            //     }
            //     // cc.vv.userMgr.selectroom.push(list[i]);
            // }
            cc.log("cc.vv.userMgr.selectroom = ", cc.vv.userMgr.selectroom);
        }
        // cc.log("cc.vv.userMgr.selectroom = ", cc.vv.userMgr.selectroom);
        this.refreshSelect();
    },

    refreshSelect:function(){
        cc.log("刷新状态显示  cc.vv.userMgr.selectroom = ", cc.vv.userMgr.selectroom);
        // for(var i  = 0; i < this.guolvlist.childrenCount; i++){
        //     var node = this.guolvlist.children[i];
        //     if(!node){
        //         cc.log("节点不存在！");
        //         continue;
        //     }
        //     var toggle = node.getComponentInChildren(cc.Toggle);
        //     // cc.log('toggle.node.name = ', toggle.node.name);
        //     if(!toggle){
        //         cc.log("节点不存在！");
        //         continue;
        //     }
        //     cc.log("toggle.node.name = ", toggle.node.name);
        //     // if(this.inSelectRoom(toggle.node.name)){
        //     //     cc.log("toggle = ", toggle);
        //     //     toggle.isChecked = true;
        //     // }else{
        //     //     toggle.isChecked = false;
        //     // }
        //     // if(toggle.node.name == cc.vv.userMgr.selectroom[0]){
        //     //     toggle.isChecked = true;
        //     //     cc.log("toggle.isChecked = ", toggle.isChecked);
        //     //     // cc.log("toggle = ", toggle);
        //     //     // return;
        //     // }
            
        //     // toggle.isChecked = toggle.node.name == cc.vv.userMgr.selectroom[0];
        //     // cc.log("toggle.isChecked = ", toggle.isChecked);
        //     // if(toggle.isChecked)return;
        // }
        // this.allgameToggle.isChecked =true
    },
    setSelect(){
        // cc.log("点开选择界面了！");
        // cc.log("cc.vv.userMgr.selectroom = ", cc.vv.userMgr.selectroom);
        for(var i  = 0; i < this.guolvlist.childrenCount; i++){
            var node = this.guolvlist.children[i];
            if(!node){
                cc.log("节点不存在！");
                continue;
            }
            var toggle = node.getComponentInChildren(cc.Toggle);
            // cc.log("toggle.node.name1 = ", toggle.node.name);
            // cc.log("this.inSelectRoom(toggle.node.name) = ", this.inSelectRoom(toggle.node.name));
            console.log('toggle123123123123123123', toggle.node.name)
            toggle.isChecked = this.inSelectRoom(toggle.node.name);
            console.log('toggle123123123123123123', this.inSelectRoom(toggle.node.name))
            console.log('selectroom', cc.vv.userMgr.selectroom)
            // cc.log("node.name = ", node.getComponentInChildren(cc.Toggle).name);
            // node.getComponentInChildren(cc.Toggle).isChecked = 
        }
    },
    inSelectRoom(name){
        // cc.log('name = ', name);
        // cc.log("cc.vv.userMgr.selectroom = ", cc.vv.userMgr.selectroom);
        for(let i = 0; i < cc.vv.userMgr.selectroom.length; i ++){
            if(name == cc.vv.userMgr.selectroom[i]){
                return true;
            }
        }
        return false;
    },

    isToggled:function(value){
        for(var i = 0; i < cc.vv.userMgr.selectroom.length; i++){
            if(value == cc.vv.userMgr.selectroom[i]){
                return i;
            }
        }
        return null;
    },

    guolvChecked:function(event){
        cc.log("点击了桌子筛选 event = ", event);
        if(!this.nodeGuolv.active){
            return;
        }
        let roomtype = [];
        for(var i  = 0; i < this.guolvlist.childrenCount; i++){
            var node = this.guolvlist.children[i];
            if(!node){
                cc.log("节点不存在！");
                continue;
            }
            var toggle = node.getComponentInChildren(cc.Toggle);
            // cc.log('toggle.node.name = ', toggle.node.name);
            if(!toggle){
                cc.log("节点不存在！");
                continue;
            }
            if(toggle.isChecked){
                let name = toggle.node.name;
                name = name + "";
                cc.log('name = ', name);
                // let rtype = cc.vv.userMgr.roomlist[name]+" ";
                roomtype.push(name);
            }
        }
        cc.sys.localStorage.setItem(cc.vv.userMgr.club_id+"roomtype",roomtype);
        cc.vv.userMgr.selectroom = roomtype;
        cc.log("roomtype = ", roomtype);
        //设置缓存并刷新显示
        this.refreshRoom();
        // var roomtype = cc.sys.localStorage.getItem(cc.vv.userMgr.club_id+"roomtype");
        // // cc.log("roomtype = ", roomtype);
        // if(roomtype == null){
        //     // roomtype = "";
        //     roomtype = [];
        // }
        // var name = event.node.parent.name;
        // let rtype = cc.vv.userMgr.roomlist[name]+" ";
        // roomtype = cc.vv.userMgr.roomlist[name]+" ";
        // // cc.log("roomtype2 = ", roomtype);
        // cc.vv.userMgr.selectroom=[cc.vv.userMgr.roomlist[name]];
        // // cc.log("selectroom = ", cc.vv.userMgr.selectroom);
        
        // cc.sys.localStorage.setItem(cc.vv.userMgr.club_id+"roomtype",roomtype);
        // // this.refreshSelect();
        // //设置缓存并刷新显示
        // this.refreshRoom();
    },

    selectAll: function(event) {
        if (!event) {
            return
        }
        // this.toggleArr.forEach(element => {
        //     element.isChecked = event.isChecked;
        // });
        let times = this.toggleArr.length;
        this.execute(this.setChecked, this, 0, times, 1, event.isChecked);
    },

    execute: function(fun, target, start, max, executeTime, data = null) {
        //获取开始时间
        var startTime = new Date().getTime();
        //执行计数
        var count = start;
        //开始执行函数，如果超过分配的执行时间，则延迟到下一帧执行
        for (var i = count; i < max; i++) {
            //执行函数
            fun.call(target, count, data);
            //超过最大执行次数，则退出
            count++;
            if (count >= max) {
                return;
            }
            //获取消耗时间
            let costTime = new Date().getTime() - startTime;
            console.log("执行耗时:", costTime);
            //消耗时间 > 分配的时间，则延迟到下一帧执行
            if (costTime > executeTime) {
                console.log("超时，进入下一轮加载")
                this.scheduleOnce(() => { this.execute(fun, target, count, max, executeTime, data) });
                return;
            }
        }
    },

    setChecked: function(index, isChecked) {
        this.toggleArr[index].isChecked = isChecked
    },

    back_action:function(list){
        var speed = 0.4;
        var offset_x = 250;
        list.opacity = 0;
        //list.scale = 0.8;

        list.x = list.x + offset_x;
        list.runAction(cc.sequence(
            cc.spawn(
                cc.fadeTo(speed,255),  
                cc.moveTo(speed,cc.v2(list.x - offset_x,list.y))
                //cc.scaleTo(speed,1,1)
            ),
            cc.callFunc(function () {
            },),
        ));
    },

    

    update (dt) {
        var x = this.clubinfo.node.x;
        x -= dt*100;
        if(x + this.clubinfo.node.width < -500){
            x = 341;
        }
        this.clubinfo.node.x = x;
        if(this.update_times>=5){
            // cc.log("触发了刷新桌子！");
            // cc.vv.net1.quick('club_room_list',{club_id:cc.vv.userMgr.club_id})
            this.update_times = 0
        }else{
            this.update_times =this.update_times+dt
        }
    },
});
