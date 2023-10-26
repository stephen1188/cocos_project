cc.Class({
    extends: cc.Component,

    properties: {
        lblNum:cc.Label,
        lblName:cc.Label,
        lblID:cc.Label,
        lblPwb:cc.Label,
        head:cc.Node,
        btns:cc.Node,
        identify:cc.Sprite,
        btn_save:cc.Button,
        xiaji:cc.EditBox,
        statusAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        input:cc.Node,
        input1:cc.Node,
        _job:0,
        _rate:0
    },
    onLoad() {
        this.initEventHandlers();
    },
    show(userid,is_friend){
        this.lblName.string = '';
        this.lblID.string = '';
        this.head.getComponent(cc.Sprite).spriteFrame = null;
        if(this.lblPwb){
            this.lblPwb.string = 0;
        }
        if(this.lblNum){
            this.lblNum.string = 0;
        }
        if(this.btn_save){
            this.btn_save.interactable = false;
        }
        if(this.xiaji){
            this.xiaji.string =0
        }
      
        this.is_friend = is_friend
        if(is_friend){
            cc.vv.net1.quick('club_user_friend_pwb',{club_id:cc.vv.userMgr.club_id,user_id:userid});
        }else{
            cc.vv.net1.quick('club_user_view_pwb',{club_id:cc.vv.userMgr.club_id,user_id:userid});
        }
    },

    info:function(data){
        this._job = data.job;
        if(this.btn_save){
            this.btn_save.interactable = true;
        }
        this.lblName.string = data.username;
        this.lblID.string = data.userid;
        this._rate = data.rate
        this.head.getComponent(cc.Sprite).spriteFrame = data.headimg;
        if(data.pwb !== null){
            if(this.lblPwb){
                this.lblPwb.string = cc.vv.utils.numFormat(data.pwb);
            }
        }
        if(this.lblNum){
            this.lblNum.string = 0;
        }
        if(this.btns){
            for(var i = 0; i < this.btns.childrenCount; ++i){
                this.btns.children[i].active = false;
            }
            this.refreshBtns(data.limit,data.status);
        }
        
        this.userStatus(data.status);
    },

    refreshBtns:function(limit,status){
        this.btns.getChildByName('btn_tcqz1').active = limit == 1;
        this.btns.getChildByName('btn_tcqz2').active = limit == 0;
        this.btns.getChildByName('btn_jinwan1').active = limit==1&&status==1;
        this.btns.getChildByName('btn_jinwan2').active = limit==0&&status==1;
        this.btns.getChildByName('btn_jiejin1').active = limit==1&&status==-1;
        this.btns.getChildByName('btn_jiejin2').active = limit==0&&status==-1;
        this.btns.getChildByName('Nodexiaji').active = limit == 1;

        this.btns.getChildByName('btn_rate').active = true;
        //没有比例 不给显示
        // if(!this._rate){
            // this.btns.getChildByName('btn_rate').active = false
        // }
        //圈主设置下级 在外边 这里也不给显示
        // if(cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].job ==9){this.btns.getChildByName('btn_rate').active = false}
    },

    userStatus:function(status){
        var sf = null;
        if(status == -1){
            //禁玩标识
            sf = this.statusAtlas.getSpriteFrame('club_member_black');
        }
        else{
            sf = this.userIdentify();
        }
        this.identify.spriteFrame = sf;
    },

    userIdentify:function(){
        var sf = null;
        switch(this._job){
            case 9:
                sf = this.statusAtlas.getSpriteFrame('club_member_type0');
                break;
            case 2:
                sf = this.statusAtlas.getSpriteFrame('group_member_type1');
                break;
            case 1:
                sf = this.statusAtlas.getSpriteFrame('group_member_type2');
                break;
            case 0:
                sf = null;
                break;
        }
        return sf;
    },

    changePwb:function(num){
        this.lblNum.string = num.toFixed(1);
    },

    newPwb:function(num){
        this.lblPwb.string = cc.vv.utils.numFormat(num);
        //this.lblNum.string = 0;
        if (this.is_friend){}else{
            cc.vv.userMgr.clubUsers[cc.vv.userMgr.club_id][this.lblID.string].pwb = parseFloat(num);
        }
    },
    //监听协议
    initEventHandlers: function () {
        var self=this;
        //var input = this.node.getChildByName("pwb").getChildByName("editpwb").getChildByName("outnum");
        if(!this.input)return;
        this.input.on(cc.Node.EventType.TOUCH_START,function(){
            cc.vv.popMgr.pop("table/input_pwb",function(obj){
                obj.getComponent("Inputpwb").info(self.lblID.string,self.lblPwb.string,self.lblNum,0);
            });
        });
        // if(!this.input1)return;
        // this.input1.on(cc.Node.EventType.TOUCH_START,function(){
        //     cc.vv.popMgr.pop("table/input_pwb",function(obj){
        //         obj.getComponent("Inputpwb").info(self.lblID.string,0,self.xiaji,0);
        //     });
        // });
    },
    onBtnClicked:function(event){
        cc.vv.audioMgr.click();
        var self = this;
        var pwb
        if (cc.vv.userMgr.clubUsers && self._job == 9){
            pwb = parseFloat(cc.vv.userMgr.clubUsers[cc.vv.userMgr.club_id][this.lblID.string].pwb)
        }else{
            pwb = this.lblPwb.string
        }
        switch(event.target.name){
            case 'btn_pwb':{
                cc.vv.net1.quick("club_pwb_list",{club_id:cc.vv.userMgr.club_id,player_id:this.lblID.string,type:0});
                this.node.active = false;
            }
            break;
            case 'btn_plus50':{
                var num = parseFloat(this.lblNum.string) - 50;
                var ls_num = parseFloat(num) + parseFloat(pwb)
                if(pwb == 0){
                    if(num <= 0){
                        num = 0;
                    }
                }
                else if(pwb > 0){
                    if((ls_num) < 0){
                        num = 0 - pwb;
                    }
                }
                else if(pwb < 0){
                    if((ls_num) < 0 && num < 0){
                        num = 0;
                    }
                }
                this.changePwb(num);
            }
            break;
            case 'btn_plus100':{
                var num = parseFloat(this.lblNum.string) - 100;
                var ls_num = parseFloat(num) + parseFloat(pwb)
                if(pwb == 0){
                    if(num <= 0){
                        num = 0;
                    }
                }
                else if(pwb > 0){
                    if(ls_num < 0){
                        num = 0 - pwb;
                    }
                }
                else if(pwb < 0){
                    if(ls_num < 0 && num < 0){
                        num = 0;
                    }
                }
                this.changePwb(num);
            }
            break;
            case 'btn_add50':{
                var num = parseFloat(this.lblNum.string) + 50;
                this.changePwb(num);
            }
            break;
            case 'btn_add100':{
                var num = parseFloat(this.lblNum.string) + 100;
               this.changePwb(num);
            }
            break;
            case 'btn_save':{
                if(this.lblNum.string != 0){
                    if (self.is_friend){
                        var club_user_pwb = {
                            method:"club_user_pwb_loss",
                            data:{
                                club_id:cc.vv.userMgr.club_id,
                                user_id:this.lblID.string,
                                pwb:this.lblNum.string
                            }
                        };
                        cc.vv.popMgr.wait("正在修改胜点",function(){
                            cc.vv.net1.send(club_user_pwb);
                        });
                        this.lblNum.string = 0;
                        
                    }else{
                        var club_user_pwb = {
                            method:"club_user_pwb",
                            data:{
                                version:cc.SERVER,
                                club_id:cc.vv.userMgr.club_id,
                                user_id:this.lblID.string,
                                pwb:this.lblNum.string
                            }
                        };
                        cc.vv.popMgr.wait("正在修改胜点",function(){
                            cc.vv.net1.send(club_user_pwb);
                        });
                        this.lblNum.string = 0;
                    }
                }
            }
            break;
            case 'btn_jinwan1':{
                //event.target.active = false;
                cc.vv.net1.quick("club_user_black",{club_id:cc.vv.userMgr.club_id,user_id:this.lblID.string,status:-1});
                //this.btns.getChildByName('btn_jiejin1').active = true;
            }
            break;
            case 'btn_jiejin1':{
                //event.target.active = false;
                cc.vv.net1.quick("club_user_black",{club_id:cc.vv.userMgr.club_id,user_id:this.lblID.string,status:1});
                //this.btns.getChildByName('btn_jinwan1').active = true;
            }
            break;
            case 'btn_tcqz1':{
                cc.vv.popMgr.alert("确定要将玩家" + self.lblName.string + "踢出圈子吗？",function(){
                    cc.vv.net1.quick("club_user_kick",{club_id:cc.vv.userMgr.club_id,user_id:self.lblID.string});
                },true);
            }
            break;
            case "bind_junior":{
                //  绑定下级玩家
                if(self.xiaji.string ==""){
                    cc.vv.popMgr.tip("请输入正确的数");
                }else{
                    cc.vv.net1.quick("bind_junior",{club_id:cc.vv.userMgr.club_id,junior_id:self.xiaji.string,player_id:this.lblID.string});
                }
            }
            break;
            case "unbind_junior":{
                //解绑下级玩家
                if(self.xiaji.string ==""){
                    cc.vv.popMgr.tip("请输入正确的数");
                }else{
                    cc.vv.net1.quick("un_bind_junior",{club_id:cc.vv.userMgr.club_id,junior_id:self.xiaji.string,player_id:this.lblID.string});
                }
            }
            break;
            case "btn_rate":{
                var rate = this._rate
                cc.vv.popMgr.pop('club/ClubRateTable',function(obj){
                    obj.getComponent('ClubRateTable').show(rate,self.lblID.string,true);
                });
            }
            break;
            case "btn_liebiao":{
                var rate = this._rate
                cc.vv.net1.quick("club_reward_list",{club_id:cc.vv.userMgr.club_id,player_id:self.lblID.string});
                // cc.vv.net1.quick("club_reward_list",{club_id:263,player_id:4216});
                this.node.active = false;
            }
            break;
            default:{
                cc.vv.popMgr.tip("敬请期待");
            }
        }
    },
    onclickClose(){
        cc.vv.club._clubPwb =null;
        cc.vv.club._clubPwb2 = null;
        this.node.destroy();
    },
    // u,pdate (dt) {},
});
