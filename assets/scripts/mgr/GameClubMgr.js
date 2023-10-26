cc.Class({
    extends: cc.Component,

    properties: {
        dataEventHandler:null,
    },

    dispatchEvent(event,data){
        if(this.dataEventHandler){
            this.dataEventHandler.emit(event,data);
        }else{
            cc.vv.log3.error('---------------------');
        }
    },

    clear:function(){
        this.dataEventHandler = null;
    },

    initHandlers:function(){
        var self = this;
        cc.vv.net1.addHandler("club",function(data){
            self.club(data);
        });
    },

    club:function(ret){
        var self = this;
        var data = ret.data;
        switch(ret.event){
            case 'club_list':{
    
                if(ret.errcode !== 0){
                    cc.vv.popMgr.alert(ret.errmsg);
                    cc.vv.popMgr.hide();
                    return;
                }
                //缓存亲友圈信息
                cc.vv.userMgr.clublist = {};
                cc.vv.userMgr.clublist2 = [];
                
                for(var i=0;i<data.list.length;++i){
                    for(var j = 0; j < data.list[i].rules.length; ++j){ 
                        if(typeof data.list[i].rules[j].conf == 'string'){
                            data.list[i].rules[j].conf = JSON.parse(data.list[i].rules[j].conf);
                        }
                    }
                    cc.vv.userMgr.clublist[data.list[i].club_id] = data.list[i];
                    cc.vv.userMgr.clublist[data.list[i].club_id].myTag = i;
                    cc.vv.userMgr.clublist2.push(data.list[i]);
                }
                
                if(cc.vv.club){
                    if(cc.vv.club.clubMain){
                        cc.vv.club.clubMain.getChildByName('room').removeAllChildren();
                        cc.vv.userMgr.clubroom = null;
                        cc.vv.club.clubMain.getComponent('ClubMain').show(0);
                    }
                }
            }
            break;
            case 'club_room_list':{
                // cc.log("ret = ", ret);
                // cc.log("data = ", data);
                if(ret.errcode !== 0){
                    cc.vv.popMgr.alert(ret.errmsg);
                    cc.vv.popMgr.hide();
                    // if(cc.vv.club.clubMain){
                    //     cc.vv.club.clubMain.active = false;
                    // }
                    return;
                }
                if(cc.vv.userMgr.clublist[data.clubid].userStatus == -1) return;
                if(cc.vv.userMgr.clubroom == null){
                    cc.vv.userMgr.clubroom = {};
                }
    
                //亲友圈空间
                cc.vv.userMgr.clubroom[data.clubid] = {};
                for(var i=0;i<data.list.length;++i){
                    cc.vv.userMgr.clubroom[data.clubid][data.list[i].roomid] = data.list[i];
                }
                self.dispatchEvent("club_room_list_plugs",ret);
            }
            break;
            case 'club_room':{
                //滚动公告
                if(ret.errcode !== 0){
                    cc.vv.popMgr.alert(ret.errmsg);
                    return;
                }
                if(cc.vv.userMgr.clublist[data.clubid].userStatus == -1) return;

                if(cc.vv.userMgr.clubroom == null){
                    cc.vv.userMgr.clubroom = {};
                }
    
                //亲友圈空间
                if(cc.vv.userMgr.clubroom[data.clubid] == null){
                    cc.vv.userMgr.clubroom[data.clubid] = {};
                }
                
                cc.vv.userMgr.clubroom[data.clubid][data.roomid] = data;
                self.dispatchEvent("club_room_plugs",ret);
            }
            break;
            case 'club_room_player_change':{
                if(ret.errcode !== 0){
                    cc.vv.popMgr.alert(ret.errmsg);
                    return;
                }
                if(cc.vv.userMgr.clublist[data.clubid].userStatus == -1) return;

                if(cc.vv.userMgr.clubroom == null){
                    cc.vv.userMgr.clubroom = {};
                }
    
                //亲友圈空间
                if(cc.vv.userMgr.clubroom[data.clubid] == null){
                    cc.vv.userMgr.clubroom[data.clubid] = {};
                }
                
                cc.vv.userMgr.clubroom[data.clubid][data.roomid].table = data.table;
                ret.data = cc.vv.userMgr.clubroom[data.clubid][data.roomid];
                self.dispatchEvent("club_room_plugs",ret);
            }
            break;
            case 'club_room_round':{
                if(ret.errcode !== 0){
                    cc.vv.popMgr.alert(ret.errmsg);
                    return;
                }
                if(cc.vv.userMgr.clublist[data.clubid].userStatus == -1) return;

                if(cc.vv.userMgr.clubroom == null){
                    cc.vv.userMgr.clubroom = {};
                }
    
                //亲友圈空间
                if(cc.vv.userMgr.clubroom[data.clubid] == null){
                    cc.vv.userMgr.clubroom[data.clubid] = {};
                }
                
                cc.vv.userMgr.clubroom[data.clubid][data.roomid].now_round = data.now_round;
                ret.data = cc.vv.userMgr.clubroom[data.clubid][data.roomid];
                self.dispatchEvent("club_room_plugs",ret);
            }
            break;
            case 'club_room_end':{

            }
            break;
            case 'club_room_del':{
                cc.vv.popMgr.hide();
                if(ret.errcode !== 0){
                    cc.vv.popMgr.tip(ret.errmsg);
                    if(ret.errcode == -2){
                        delete cc.vv.userMgr.clubroom[data.clubid][data.roomid];
                        if(data.clubid == cc.vv.userMgr.club_id){
                            if(cc.vv.club.clubMain){
                                cc.vv.club.clubMain.emit('club_room_del',ret);
                            }
                        }
                    }
                    return;
                }
                if(cc.vv.userMgr.clublist[data.clubid].userStatus == -1) return;
                if(cc.vv.userMgr.clubroom == null){
                    return;
                }
    
                //亲友圈空间
                if(cc.vv.userMgr.clubroom[data.clubid] == null){
                    return;
                }
                
                delete cc.vv.userMgr.clubroom[data.clubid][data.roomid];
                self.dispatchEvent("club_room_del_plugs",ret);
            }
            break;
            case 'club_rule_ptz_view':{
                cc.vv.popMgr.hide();
                if(ret.errcode !== 0){
                    cc.vv.popMgr.tip(ret.errmsg);
                    return;
                }
                if(cc.vv.userMgr.clublist[data.club_id].userStatus == -1) return;
                if(data.type == 1){
                    var isAdd = true;
                    for(var i = 0; i < cc.vv.userMgr.clublist[data.club_id].rules.length; ++i){
                        if(data.id == cc.vv.userMgr.clublist[data.club_id].rules[i].id){
                            cc.vv.userMgr.clublist[data.club_id].rules[i] = data.rule;
                            isAdd = false;
                            break;
                        }
                    }
                    if(isAdd){
                        cc.vv.userMgr.clublist[data.club_id].rules.push(data.rule);
                    }
                }
                else{
                    var rules = cc.vv.userMgr.clublist[data.club_id].rules;
                    for(var i = 0; i < rules.length; ++i){
                        if(rules[i].id == data.id){
                            rules.splice(i,1);
                            break;
                        }
                    }
                }
                self.dispatchEvent("club_rule_ptz_view_plugs",ret);
            }
            break;
            case 'club_rule_pwz_view':{
                cc.vv.popMgr.hide();
                if(ret.errcode !== 0){
                    cc.vv.popMgr.tip(ret.errmsg);
                    return;
                }
                if(cc.vv.userMgr.clublist[data.club_id].userStatus == -1) return;
                if(data.type == 1){
                    var isAdd = true;
                    for(var i = 0; i < cc.vv.userMgr.clublist[data.club_id].rules.length; ++i){
                        if(data.id == cc.vv.userMgr.clublist[data.club_id].rules[i].id){
                            cc.vv.userMgr.clublist[data.club_id].rules[i] = data.rule;
                            // if(cc.vv.club.clubMain){
                            //     cc.vv.club.clubMain.emit("club_room_list");
                            // }
                            isAdd = false;
                            break;
                        }
                    }
                    if(isAdd){
                        cc.vv.userMgr.clublist[data.club_id].rules.push(data.rule);
                    }
                    if(cc.vv.userMgr.club_id == data.club_id){
                        if(cc.vv.club.clubMain){
                            cc.vv.club.clubMain.emit("club_room_list",{type:1});
                        }
                        if(cc.vv.club._clubSetRule != null && cc.vv.club._clubSetRule.active){
                            cc.vv.club._clubSetRule.getComponent('ClubSetRule').createRule(data.rule);
                        }
                        if(cc.vv.club._clubGameList != null && cc.vv.club._clubGameList.active){
                            cc.vv.club._clubGameList.getComponent('ClubGameList').show();
                        }
                    }
                }
                else{
                    var rules = cc.vv.userMgr.clublist[data.club_id].rules;
                    for(var i = 0; i < rules.length; ++i){
                        if(rules[i].id == data.id){
                            rules.splice(i,1);
                            break;
                        }
                    }
                }
                self.dispatchEvent("club_rule_pwz_view_plugs",ret);
            }
            break;
            case 'club_user_status_change':{
                if(ret.errcode !== 0){
                    cc.vv.popMgr.tip(ret.errmsg);
                    cc.vv.popMgr.hide();
                    return;
                }
                cc.vv.userMgr.clublist[data.clubid].userStatus = data.userStatus;
                self.dispatchEvent("club_user_status_change_plugs",ret);
            }
            break;
            case 'club_user_pwb':{
                cc.vv.popMgr.hide();
               
                if(ret.errcode !== 0){
                    cc.vv.popMgr.tip(ret.errmsg);
                    return;
                }
                cc.vv.popMgr.tip(ret.errmsg);

                if(cc.vv.game){
                    cc.vv.game.node.emit('club_user_pwb',ret);
                }else{
                    self.dispatchEvent("club_user_pwb_plugs",ret);
                }
            }
            break;
            case 'club_user_pwb_change':{
                cc.vv.popMgr.hide();
                if(ret.errcode !== 0){
                    cc.vv.popMgr.tip(ret.errmsg);
                    return;
                }
                cc.vv.userMgr.clublist[data.clubid].pwb = data.pwb;
                cc.vv.userMgr.clublist[data.clubid].ticket = data.ticket;
                self.dispatchEvent("club_user_pwb_change_plugs",ret);
            }
            break;
            case 'club_user_admin_view':{
                cc.vv.popMgr.hide();
                if(ret.errcode !== 0){
                    cc.vv.popMgr.tip(ret.errmsg);
                    return;
                }
                if(data.userId == cc.vv.userMgr.userid){
                    cc.vv.userMgr.clublist[data.clubId].job = data.job;
                    if(data.clubId == cc.vv.userMgr.club_id){
                        if(cc.vv.club.clubMain){
                            cc.vv.club.clubMain.getComponent('ClubMain').show(data.clubId);
                        }
                    }
                    if(data.job != 2){
                        if(data.clubId == cc.vv.userMgr.club_id){
                            if(cc.vv.club.clubMain){
                                cc.vv.club.clubMain.getComponent('ClubMain').show(data.clubId);
                            }
                            if(cc.vv.club._clubSet){
                                cc.vv.club._clubSet.active = false;
                            }
                            if(cc.vv.club._clubSetRule){
                                cc.vv.club._clubSetRule.active = false;
                            }
                            cc.vv.popMgr.del_pop('ClubSelectType');
                            cc.vv.popMgr.del_pop('ClubPwz');
                            cc.vv.popMgr.del_pop('CreateRoom');
                            cc.vv.popMgr.del_pop('ClubInputPwz');
                        }
                    }  
                }else{
                    
                }
                if(cc.vv.userMgr.clubUsers == null){
                    cc.vv.net1.quick("club_users",{club_id:data.clubId,type:4});
                }
                else{
                    cc.vv.userMgr.clubUsers[data.clubId][data.userId].job = data.job;
                    if(cc.vv.club._clubSet && cc.vv.club._clubSet.active){
                        cc.vv.club._clubSet.getComponent('ClubSetting').admSet();
                    }
                }
                //self.dispatchEvent("club_user_admin_view_plugs",ret);
            }
            break;
            case 'club_info_view':{
                cc.vv.popMgr.hide();
                if(ret.errcode !== 0){
                    cc.vv.popMgr.tip(ret.errmsg);
                    return;
                }
                cc.vv.userMgr.clublist[data.club_id].name = data.name;
                cc.vv.userMgr.clublist[data.club_id].desc = data.desc;
                cc.vv.userMgr.clublist[data.club_id].info = data.info;
                cc.vv.userMgr.clublist[data.club_id].max_user = data.max_user;
                cc.vv.userMgr.clublist[data.club_id].max_table = data.max_table;
                self.dispatchEvent("club_info_view_plugs",ret);
            }
            break;
            case 'club_creator_update_view':{
                cc.vv.popMgr.hide();
                if(ret.errcode !== 0){
                    cc.vv.popMgr.tip(ret.errmsg);
                    return;
                }
                cc.vv.userMgr.clublist[data.club_id].creator = data.creator;
                cc.vv.userMgr.clublist[data.club_id].creator_headimg = data.headimg;
                cc.vv.userMgr.clublist[data.club_id].creator_name = data.name;
                cc.vv.userMgr.clublist[data.club_id].ticket = data.ticket;
                cc.vv.userMgr.clublist[data.club_id].clubno = data.clubno;
                if(cc.vv.userMgr.userid == data.creator){
                    cc.vv.userMgr.clublist[data.club_id].job = 9;
                }
                self.dispatchEvent("club_creator_update_view_plugs",ret);
            }
            break;
            case 'club_add_del':{
                cc.vv.popMgr.hide();
                if(ret.errcode !== 0){
                    cc.vv.popMgr.tip(ret.errmsg);
                    return;
                }
                if(cc.vv.userMgr.clublist == null){
                    cc.vv.userMgr.clublist = {}
                }
                if(data.type == undefined){
                    cc.vv.userMgr.clublist2.push(data);
                    data.myTag = cc.vv.userMgr.clublist2.length-1;
                    cc.vv.userMgr.clublist[data.club_id] = data;
                }
                else{
                    delete cc.vv.userMgr.clublist[data.club_id];
                    for(var i = 0; i < cc.vv.userMgr.clublist2.length; i++){
                        if(data.club_id == cc.vv.userMgr.clublist2[i].club_id){
                            cc.vv.userMgr.clublist2.splice(i,1);
                            break;
                        }
                    }
                }
                self.dispatchEvent("club_add_del_plugs",ret);
            }
            break;
            case 'club_notice':{
                cc.vv.popMgr.hide();
                if(ret.errcode !== 0){
                    cc.vv.popMgr.alert(ret.errmsg);
                    return;
                }
                self.dispatchEvent("club_notice_plugs",ret);
            }
            break;
            case 'club_user_master':{
                cc.vv.popMgr.hide();
                if(ret.errcode !== 0){
                    cc.vv.popMgr.tip(ret.errmsg);
                    return;
                }
                if(!cc.vv.userMgr.clublist[data.club_id]){
                    return;
                }
                cc.vv.userMgr.clublist[data.club_id].is_master = data.is_master;
                cc.vv.userMgr.clublist[data.club_id].rate = data.rate;
                self.dispatchEvent("club_user_master_plugs",ret);
            }
            break;
            case "club_info":{
                cc.vv.popMgr.hide();
                if(ret.errcode !== 0){
                    cc.vv.popMgr.tip(ret.errmsg);
                    return;
                }
                var is_add = true;
                for(var i = 0; i < cc.vv.userMgr.clublist2.length; i++){
                    if(data.club_id == cc.vv.userMgr.clublist2[i].club_id){
                        is_add = false;
                        break;
                    }
                }
                if(is_add){
                    cc.vv.userMgr.clublist2.push(data);
                    data.myTag = cc.vv.userMgr.clublist2.length-1;
                }else{
                    data.myTag = cc.vv.userMgr.clublist[data.club_id].myTag;
                }
                cc.vv.userMgr.clublist[data.club_id] = data;
                self.dispatchEvent("club_info_plugs",ret);
            }
            break;
            default:{
                self.dispatchEvent(ret.event,ret);
            }
        }
    }
   

    // update (dt) {},
});
