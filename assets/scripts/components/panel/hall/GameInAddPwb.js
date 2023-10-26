cc.Class({
    extends: cc.Component,

    properties: {
        lblNum:cc.Label,
        lblName:cc.Label,
        lblID:cc.Label,
        lblPwb:cc.Label,
        head:cc.Node,
       // btns:cc.Node,
        identify:cc.Sprite,
        statusAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },

        _job:0,
    },
    onLoad() {
        this.initEventHandlers();
    },
    show(data){
        this.lblName.string = data.username;
        this.lblID.string = data.userid;
        this.head.getComponent(cc.Sprite).spriteFrame = data.headimg;
        
        if(data.pwb !== null){
            this.lblPwb.string = data.pwb;
        }
        if(this.lblNum){
            this.lblNum.string = 0;
        }
        this._job = data.job;
        // if(this.btns){
        //     for(var i = 0; i < this.btns.childrenCount; ++i){
        //         this.btns.children[i].active = false;
        //     }
        //     this.refreshBtns(data.limit,data.status);
        // }
       
        this.userStatus(data.status);
    },

    refreshBtns:function(limit,status){
        this.btns.getChildByName('btn_tcqz1').active = limit == 1;
        this.btns.getChildByName('btn_tcqz2').active = limit == 0;
        this.btns.getChildByName('btn_jinwan1').active = limit==1&&status==1;
        this.btns.getChildByName('btn_jinwan2').active = limit==0&&status==1;
        this.btns.getChildByName('btn_jiejin1').active = limit==1&&status==-1;
        this.btns.getChildByName('btn_jiejin2').active = limit==0&&status==-1;
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
        this.lblPwb.string = num;
        //this.lblNum.string = 0;
        cc.vv.userMgr.clubUsers[cc.vv.userMgr.club_id][this.lblID.string].pwb = num;
    },
    info:function(data){
        var data = data.data;
        this.lblPwb.string = data.pwb;
        this.lblNum.string = 0;
        this.lblName.string = data.name;
        this.lblID.string = data.playerid;
        this.node.getChildByName("head").getChildByName("headimg").getComponent("ImageLoader").loadImg(data.headimg);
        if(data.pwb !== null){
            this.lblPwb.string = data.pwb;
        }
        if(this.lblNum){
            this.lblNum.string = 0;
        }
        this.clubid = data.club_id;
        this._job = data.job;
        var sf = null;
        sf = this.userIdentify();
        this.identify.spriteFrame = sf;
        var suofen = this.node.getChildByName("suofen")
        if(data.diFen == 0){
            suofen.active = false;
        }else{
            suofen.active = true;
            suofen.getComponent(cc.Label).string = data.diFen;
        }
    },
    //监听协议
    initEventHandlers: function () {
        var self=this;
        var input = this.node.getChildByName("pwb").getChildByName("editpwb").getChildByName("outnum");
        input.on(cc.Node.EventType.TOUCH_START,function(){
            cc.vv.popMgr.pop("table/input_pwb",function(obj){
                obj.getComponent("Inputpwb").info(self.lblID.string,self.lblPwb.string,self.lblNum,1);
            });
        });
    },
    onBtnClicked:function(event){
        cc.vv.audioMgr.click();
        var self = this;
        var pwb = this.lblPwb.string;
        switch(event.target.name){
            case 'btn_pwb':{
                cc.vv.net1.quick("club_pwb_list",{club_id:cc.vv.userMgr.club_id,player_id:this.lblID.string,type:0});
                this.node.active = false;
            }
            break;
            case 'btn_plus50':{
                var num = parseFloat(this.lblNum.string) - 50;
                if(pwb == 0){
                    if(num <= 0){
                        num = 0;
                    }
                }
                else if(pwb > 0){
                    if(num + pwb < 0){
                        num = 0 - pwb;
                    }
                }
                else if(pwb < 0){
                    if(num + pwb < 0 && num < 0){
                        num = 0;
                    }
                }
                this.changePwb(num);
            }
            break;
            case 'btn_plus100':{
                var num = parseFloat(this.lblNum.string) - 100;
                if(pwb == 0){
                    if(num <= 0){
                        num = 0;
                    }
                }
                else if(pwb > 0){
                    if(num + pwb < 0){
                        num = 0 - pwb;
                    }
                }
                else if(pwb < 0){
                    if(num + pwb < 0 && num < 0){
                        num = 0;
                    }
                }
                this.changePwb(num);
            }
            break;
            case 'btn_add50':{
                var num = parseInt(this.lblNum.string) + 50;
                this.changePwb(num);
            }
            break;
            case 'btn_add100':{
                var num = parseInt(this.lblNum.string) + 100;
               this.changePwb(num);
            }
            break;
            case 'btn_save':{
                if(this.lblNum.string < 0){
                    cc.vv.popMgr.tip("该玩家正在游戏中无法扣除胜点");
                    return;
                }
                if(this.lblNum.string != 0){
                    var club_user_pwb = {
                        method:"club_user_pwb",
                        data:{
                            version:cc.SERVER,
                            club_id:this.clubid,
                            user_id:this.lblID.string,
                            pwb:this.lblNum.string
                        }
                    };
                    cc.vv.popMgr.wait("正在修改胜点",function(){
                        cc.vv.net2.send(club_user_pwb);
                    });
                    this.lblNum.string = 0;
                }
            }
            break;
            case 'btn_jinwan1':{
                event.target.active = false;
                cc.vv.net1.quick("club_user_black",{club_id:cc.vv.userMgr.club_id,user_id:this.lblID.string,status:-1});
                this.btns.getChildByName('btn_jiejin1').active = true;
            }
            break;
            case 'btn_jiejin1':{
                event.target.active = false;
                cc.vv.net1.quick("club_user_black",{club_id:cc.vv.userMgr.club_id,user_id:this.lblID.string,status:1});
                this.btns.getChildByName('btn_jinwan1').active = true;
            }
            break;
            case 'btn_tcqz1':{
                cc.vv.popMgr.alert("确定要将玩家" + self.lblName.string + "踢出圈子吗？",function(){
                    cc.vv.net1.quick("club_user_kick",{club_id:cc.vv.userMgr.club_id,user_id:self.lblID.string});
                },true);
            }
            break;
            default:{
                cc.vv.popMgr.tip("敬请期待");
            }
        }
    }

    // update (dt) {},
});
