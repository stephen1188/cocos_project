cc.Class({
    extends: cc.Component,

    properties: {
        lblName:cc.Label,
        lblID:cc.Label,
        head:cc.Node,
        identify:cc.Sprite,
        statusAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        last_node:cc.Node,
        last_id:cc.Label,
        _pwb:0,
        _headimg:"",
        _job:0,
        _status:1,
        _mark:0,
        _limit:0,
        _rate:0,
        itemID:0,
    },
    updateID(id){
        this.itemID = id;
    },
    init:function(data){
        var self = this;
        self.lblName.string = data.name;
        self.lblID.string = data.userid;
        self.identify.node.active = false;
        self._pwb = data.pwb;
        self._headimg = data.headimg;
        self._job = data.job;
        self.pid = data.pid;
        self._rate = data.rate;
        var sf = null;
        switch(data.job){
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
        self.identify.node.active = true;
        this.identify.spriteFrame = sf;
        self._status = data.status;
        if (self.pid&&self.pid!=0){
            self.last_node.active = true
            self.last_id.string = self.pid
        }
        self.head.getComponent("ImageLoader").loadImg(data.headimg);
    },

    permission:function(){
        this.power = 1;
        var self = this;
        cc.vv.popMgr.pop('club/UserManager',function(obj){
            cc.vv.club._clubPwb = obj;
            obj.getComponent('UserManager').show(self.lblID.string);   
        });
    },

    memberinfo:function(data){
        
        var self = this;
        var spr = this.head.getComponent(cc.Sprite).spriteFrame;
        //var status =  cc.vv.userMgr.clubUsers[data.club_id][data.user_id].status;
        if(!cc.vv.club._clubPwb){
            return;
        }
        if(this.power == 1){
            cc.vv.club._clubPwb.getComponent('UserManager').info({club_id:cc.vv.userMgr.club_id,
                username:data.name,
                userid:data.user_id,
                headimg:spr,job:self._job,
                pwb:data.pwb,status:data.status,
                limit:self._limit,
                rate:self._rate});
        }else{
            cc.vv.club._clubPwb2.getComponent('UserManager').info({club_id:cc.vv.userMgr.club_id,
                username:data.name,
                userid:data.user_id,
                headimg:spr,job:self._job,
                pwb:data.pwb,status:data.status,
                limit:self._limit,
                rate:self._rate});
        }
       
    },

    nopermission:function(){
        this.power = 0;
        var self = this;
        cc.vv.popMgr.pop('club/NoManager',function(obj){
            cc.vv.club._clubPwb2 = obj;
            obj.getComponent('UserManager').show(self.lblID.string);   
        });
    },

    onBtnClicked:function(event){
        var job = cc.vv.userMgr.user_job
        if(job == 0){
            this.nopermission();
        }
        else if(job == 1 || job == 2){
            if(cc.vv.userMgr.userid == this.lblID.string){
                this.nopermission();
            }
            else{
                if(job == this._job){
                    this._limit = 0;
                    this.permission();
                }
                else if(job < this._job){
                    this.nopermission();
                }
                else{
                    this._limit = 1;
                    this.permission();
                }
            }
        }
        else if(job == 9){
            if(cc.vv.userMgr.userid == this.lblID.string){
                this._limit = 0;
            }
            else{
                this._limit = 1;
            }
            this.permission();
        }
        
    }

    // update (dt) {},
});
