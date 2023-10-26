cc.Class({
    extends: cc.Component,

    properties: {
        username:cc.Label,
        userid:cc.Label,
        clubid:cc.Label,
        max_user:cc.Label,
        max_table:cc.Label,
        detail:cc.Node,
        head:cc.Node,
        clubCount:cc.Node,
        clubRank:cc.Node,
        rankListContent:cc.Node,

        textname:cc.EditBox,
        textdesc:cc.EditBox,
        textinfo:cc.EditBox,

        pwz_all:cc.Label,
        ptz_all:cc.Label,
        bmf_all:cc.Label,
        pwb_all:cc.Label,
        ffhz_all:cc.Label,
        out_pwb_day0:cc.Label,
        pwz_day0:cc.Label,
        in_pwb_day0:cc.Label,
        ptz_day0:cc.Label,
        bmf_day0:cc.Label,
        bmf_day1:cc.Label,
        yearTicketCount:cc.Label,
        monthTicketCount:cc.Label,
        master_bmfday0:cc.Label,
        master_bmfday1:cc.Label,
        master_bmfall:cc.Label,
        btn_update:cc.Node,
        btn_rate:cc.Node,
        menu:cc.Node,
        textDelarID: cc.EditBox,
        delarFitLabel: cc.Label,
        _club_id:"",
        _toggles:null,
        _panels:null,
        _rankType:"",

        rankItemPrefab:cc.Prefab,

        rankAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },

        isHostNode:cc.Node
    },

    onLoad:function(){
        if(cc.winSize.width / cc.winSize.height - 16 / 9 > 0.1){ 
            var width = cc.winSize.width;
            this.node.width = width;
        }
        this._toggles =  this.node.getChildByName("toggles");
        this._panels =  this.node.getChildByName("panels");
        var type = this._toggles.children[0].name;
        this._toggles.children[1].active = false;
        
        cc.vv.utils.setToggleChecked(this._toggles,type);
        this.onBtnleiXingXuanZe(null,type);
    },
    
    onEnable:function(){
        this.textDelarID.string = '';
        var type = this._toggles.children[0].name;
        cc.vv.utils.setToggleChecked(this._toggles,type);
        
        this.onBtnleiXingXuanZe(null,type);
    },

    onBtnleiXingXuanZe:function(event,detail){
        if(event != null){
            cc.vv.audioMgr.click();
        }
        if(detail == null)detail = event.target.name;
        for(var i = 0; i < this._panels.children.length; ++i){
            var name = this._panels.children[i].name;
            this._panels.children[i].active = (detail == name);
        }
        if(event){
            switch(event.target.name){
                case 'info':{
                    this.show(cc.vv.userMgr.club_id);
                }
                break;
                case 'count':{
                    cc.vv.net1.quick('club_count',{club_id:cc.vv.userMgr.club_id});
                }
                break;

                case 'rank':{
                    switch(this._rankType){
                        case "":
                        case "btn_today":
                            this._rankType = 'btn_today';
                            cc.vv.popMgr.wait("正在查询中...",function(){
                                cc.vv.net1.quick('club_user_count',{club_id:cc.vv.userMgr.club_id, day:1});
                            });
                        break;
                        case "btn_yesterday":
                            this._rankType = 'btn_today';
                            cc.vv.popMgr.wait("正在查询中...",function(){
                                cc.vv.net1.quick('club_user_count',{club_id:cc.vv.userMgr.club_id, day:2});
                            });
                        break;
                        case "btn_week":
                            this._rankType = 'btn_today';
                            cc.vv.popMgr.wait("正在查询中...",function(){
                                cc.vv.net1.quick('club_user_count',{club_id:cc.vv.userMgr.club_id, day:3});
                            });
                        break;
                    }
                }
                break;

            }
        }
    },

    //排行榜(今天 昨天 本周)
    onBtnRankType:function(event,detail){
        cc.vv.audioMgr.click();
        if(detail == null)detail = event.target.name;
        if(detail == this._rankType){
            return;
        }
        if(event){
            switch(event.target.name){
                case 'btn_today':{
                    this._rankType = 'btn_today';
                    cc.vv.popMgr.wait("正在查询中...",function(){
                        cc.vv.net1.quick('club_user_count',{club_id:cc.vv.userMgr.club_id, day:1});
                    });
                }
                break;
                case 'btn_yesterday':{
                    this._rankType = 'btn_yesterday';
                    cc.vv.popMgr.wait("正在查询中...",function(){
                        cc.vv.net1.quick('club_user_count',{club_id:cc.vv.userMgr.club_id, day:2});
                    });
                }
                break;

                case 'btn_week':{
                    this._rankType = 'btn_week';
                    cc.vv.popMgr.wait("正在查询中...",function(){
                        cc.vv.net1.quick('club_user_count',{club_id:cc.vv.userMgr.club_id, day:3});
                    });
                }
                break;
            }
        }
    },


    show:function(id){
        this._club_id = id;
        var data = cc.vv.userMgr.clublist[id];

        if(data == null){
            this.node.destroy();
            cc.vv.popMgr.alert('您未加入到乐圈');
            return;
        }
        this.menu.active = false;
        this.clubDetail(data);
    },

    count:function(data){
        this.pwz_all.string = data.all.pwz;
        this.ptz_all.string = data.all.ptz;
        this.bmf_all.string = data.all.bmf;
        this.pwb_all.string = data.all.pwb;
        this.ffhz_all.string = data.ffhz;
        this.out_pwb_day0.string = data.day0.out_pwb;
        this.pwz_day0.string = data.day0.pwz;
        this.ptz_day0.string = data.day0.ptz;
        this.in_pwb_day0.string = data.day0.in_pwb;
        this.bmf_day0.string = data.day0.bmf;
        this.bmf_day1.string = data.day1.bmf;
        this.yearTicketCount.string = data.yearTicketCount;
        this.monthTicketCount.string = data.monthTicketCount;
        this.master_bmfday0.string = data.day0.master_bmf;
        this.master_bmfday1.string = data.day1.master_bmf;
        this.master_bmfall.string = data.all.master_bmf;
    },


    clubDetail:function(data){
        this.clubid.string = '圈子ID:' + data.clubno;
        this.username.string = cc.vv.utils.isEmojiCharacter(data.creator_name) ? cc.vv.utils.checkUserName(data.creator_name) : data.creator_name;
        // this.clubCount.active = data.job > 1;
        // this.clubRank.active = data.job > 1;
        this.clubCount.active = data.job == 9;
        this.clubRank.active = data.job == 9;
        this.userid.string = 'ID:' + data.creator;
        this.textname.string = data.name;
        this.textdesc.string = data.desc;
        this.textinfo.string = data.info;
     
        var user = data.job > 0 ? data.user : "*";
       
        this.head.getComponent("ImageLoader").loadImg(data.creator_headimg);
        cc.vv.log3.info("==="+data.max_table)
        cc.vv.log3.info("==="+data.max_user)
        cc.vv.log3.info("==="+data.job)
        if(cc.isValid(this.isHostNode)){
            this.isHostNode.active = data.job == 9;
            this.max_table.string = '最多' + data.max_table + '桌';
            this.max_user.string = user + '/' + data.max_user + '人';
        }
        
        if(data.max_table != 40 && data.max_user != 1000 && data.job == 9){
            this.btn_update.active = true;
        }else{
            this.btn_update.active = false;
        }
    },

    editNameEnd:function(event){
        this.club_name.string = event.string;
    },

    editDescEnd:function(event){
        //this.club_desc.string = event.string;
    },

    editInfoEnd:function(event){
        //this.club_info.string = event.string;
    },

    //初始化排行榜
    initRank:function(data){
        cc.vv.log3.debug(data);
        this.rankListContent.removeAllChildren();
        var list = data.list;
        for (let index = 0; index < list.length; index++) {
            //{"score":-11,"number":0,"headimg":"","round":10,"user_id":3068,"club_id":6.26966282E8,"name":"80000","type":1,"day":"九月 20, 2018","coin":3},
            var rankItem = cc.instantiate(this.rankItemPrefab);
            var rank_img = rankItem.getChildByName("rank_img");
            var rank_Label = rankItem.getChildByName("rank_Label");
            var user_img = rankItem.getChildByName("head").getChildByName("img");
            var user_name = rankItem.getChildByName("user_name");
            var user_id = rankItem.getChildByName("user_id");
            var user_score = rankItem.getChildByName("user_score");
            var user_field = rankItem.getChildByName("user_field");
            switch(index){
                case 0: 
                    rank_Label.active = false;
                    rank_img.getComponent(cc.Sprite).spriteFrame = this.rankAtlas.getSpriteFrame("paiming_top1");
                break;
                case 1:
                    rank_Label.active = false;
                    rank_img.getComponent(cc.Sprite).spriteFrame = this.rankAtlas.getSpriteFrame("paiming_top2");
                break;
                case 2: 
                    rank_Label.active = false;
                    rank_img.getComponent(cc.Sprite).spriteFrame = this.rankAtlas.getSpriteFrame("paiming_top3");
                break;
                default:
                    rank_Label.getComponent(cc.Label).string = index + 1 + "";
                    rank_Label.active = true;
                    rank_img.active = false;
                break;
            }
            user_id.getComponent(cc.Label).string = list[index].user_id;
            user_name.getComponent(cc.Label).string = list[index].name;
            user_score.getComponent(cc.Label).string = list[index].coin;
            user_field.getComponent(cc.Label).string = list[index].number;
            user_img.getComponent("ImageLoader").loadImg(list[index].headimg);
            this.rankListContent.addChild(rankItem);
        }
    },

    info:function(data){
        if( cc.vv.userMgr.club_id == data.club_id){
            if(this.node.active){
                this.textname.string = data.name;
                this.textdesc.string = data.desc;
                this.textinfo.string = data.info;
                
                var job = cc.vv.userMgr.clublist[data.club_id].job;
                var user = cc.vv.userMgr.clublist[data.club_id].user;
                var cur = job > 0 ? user : "*"; 
               
                if(cc.isValid(this.isHostNode)){
                    this.isHostNode.active = job==9;
                    this.max_user.string =cur + '/' + data.max_user + '人';
                    this.max_table.string ='最多' + data.max_table + '桌';
                }
                
                if(data.max_table != 40 && data.max_user != 1000 && job==9){
                    this.btn_update.active = true;
                }else{
                    this.btn_update.active = false;
                }
            }
        }
    },

    userInfo:function(data){
        var max_user = cc.vv.userMgr.clublist[data.clubId].max_user;
        if(cc.vv.userMgr.club_id == data.clubId){
            if(this.node.active){
                var job = cc.vv.userMgr.clublist[data.clubId].job;
                var cur = job > 0 ? data.count : "*";
                this.max_user.string = job == 9? cur + '/' + max_user + '人' :"";
            }
        }
    },

    hideUpdate:function(){
        this.btn_update.active = false;
    },

    onBtnClicked:function(event){
        cc.vv.audioMgr.click();
        var self = this;
        switch(event.target.name){
            case 'btn_save':{
                var name = this.textname.string;
                var desc = this.textdesc.string;
                var info = this.textinfo.string;
                var isError = false;

                var check_str_name = cc.vv.utils.testBad2('' + name);
                var check_str_dest = cc.vv.utils.testBad2('' + desc);
                var check_str_info = cc.vv.utils.testBad2('' + info);
            
                
                if(cc.vv.utils.isEmojiCharacter(name)){
                    cc.vv.popMgr.tip('信息包含特殊字符');
                    this.textname.string = cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].name;
                    isError = true;
                }
                if(cc.vv.utils.isEmojiCharacter(desc)){
                    cc.vv.popMgr.tip('信息包含特殊字符');
                    this.textdesc.string = cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].desc;
                    isError = true;
                }
                if(cc.vv.utils.isEmojiCharacter(info)){
                    cc.vv.popMgr.tip('信息包含特殊字符');
                    this.textinfo.string = cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].info;
                    isError = true;
                }
                if(isError){
                    return;
                }
                if(check_str_name){
                    cc.vv.popMgr.alert('您输入圈子名称的内容包括了不合适的关键字');
                    return;
                }
                // if(check_str_dest){
                //     cc.vv.popMgr.alert('您输入概要的内容包括了不合适的关键字');
                //     return;
                // }
                // if(check_str_info){
                //     cc.vv.popMgr.alert('您输入公告的内容包括了不合适的关键字');
                //     return;
                // }
                cc.vv.net1.quick("club_edit",{
                    club_id:this._club_id,
                    name: this.textname.string,
                    desc: this.textdesc.string,
                    info: this.textinfo.string
                });
            }
            break;
            case 'btn_update':{
                var max_table = cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].max_table;
                var max_user = cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].max_user;
                var text = "";
                if(max_user == 200){
                    text = "您确定要将圈子升级到500人、20桌吗?" + '\n' + "升级将扣除300乐豆";
                }else if(max_user == 500){
                    text = "您确定要将圈子升级到1000人、40桌吗?" + '\n' + "升级将扣除600乐豆";
                }
                cc.vv.popMgr.alert(text,function(){
                    cc.vv.net1.quick("club_update",{
                        club_id:self._club_id
                    });
                },true);
            }
            break;
            case 'btn_exit':{
                this.menu.active = false;
                let clubDetail = cc.vv.userMgr.clublist[this._club_id];
                if (clubDetail.job == 9) {
                    if(clubDetail.user != 1){
                        cc.vv.popMgr.tip('当前成员人数为' + clubDetail.user + "人，不能退出");
                        return;
                    }

                    cc.vv.popMgr.alert("您是圈主，退出将解散圈子，是否解散",function(){
                        cc.vv.net1.quick("club_remove" , {
                            club_id: self._club_id
                        })
                    } , true);
                }
                else{
                    cc.vv.popMgr.alert("您确定要离开圈子吗？",function(){
                        //cc.vv.hall.addHandler("club_user_exit",club_user_exit);
                        cc.vv.net1.quick("club_user_exit",{
                            club_id:self._club_id
                        });
                    },true);
                }
            }
            break;
            case 'btn_out':{
                //转出圈子
                // cc.vv.popMgr.pop('club/ClubOutUsers',function(obj){
                //     obj.getComponent('ClubOutUsers').init();
                // });
                this.menu.active = false;
                var job = cc.vv.userMgr.clublist[this._club_id].job;
                if(job == 9){
                    cc.vv.popMgr.pop('club/ClubOut');
                }
                else{
                    cc.vv.popMgr.tip('您不是圈主,不能转让圈子');
                } 
            }
            break;
            case 'btn_add':{
                this.menu.active = true;
            }
            break;
            case 'menushadow':{
                this.menu.active = false;
            }
            break;
            case 'btn_clear':{
                cc.vv.popMgr.alert("您确定要清除统计吗？",function(){
                    cc.vv.net1.quick("club_count_clear",{
                        club_id:self._club_id
                    });
                },true);
            }
            break;
            case "btn_rate":{
                var rate = cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].rate;
                cc.vv.popMgr.pop('club/ClubRateTable',function(obj){
                    obj.getComponent('ClubRateTable').show(rate,null,true);
                });
            }
            break;
        }
    },
    
    onDestroy:function(){
        
    },
    onBtnSearch:function(){
        if(this.textDelarID.string==""){
            return;
        }
        let playerid = parseInt(this.textDelarID.string)
        cc.vv.net1.quick("club_user_reward",{clubId:cc.vv.userMgr.club_id,playerId:playerid});
    },
    editdel:function(){
        this.textDelarID.string = '';
        this.delarFitLabel.string=0.0;
    },
    updateDelarFit(data){
        this.delarFitLabel.string=data.todayReward;
    }
    // update (dt) {},
});
