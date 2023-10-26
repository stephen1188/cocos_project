cc.Class({
    extends: cc.Component,

    properties: {
        lblName:cc.Label,
        lblID:cc.Label,
        head:cc.Node,
        toggle:cc.Toggle,

        _job:0,
        _state:false,
    },
    onLoad () {
        if(cc.winSize.width / cc.winSize.height - 16 / 9 > 0.1){ 
            var width = cc.winSize.width;
            if(this.node.name=="NormalUser"){
            }else{
                this.node.width = width;
            }
        }
    },
    init:function(data){
        this.lblName.string = data.name;
        this.lblID.string = data.userid;
        this.head.getComponent("ImageLoader").loadImg(data.headimg);
        this._job = data.job;
        if(this.toggle){
            this.toggle.isChecked = data.job === 2;
            this._state = this.toggle.isChecked;
        }
    },

    check:function(event,v){
        this.toggle.isChecked = !this.toggle.isChecked
        cc.vv.audioMgr.click();
       
        var job = 1;
        if(this.toggle.isChecked){
            job = 2;
        }
        this.resetJob(job);
    },

    onBtnClicked:function(event){
        cc.vv.audioMgr.click();
        var self = this;
        switch(event.target.name){
            case 'btn_del':{
                this.resetJob(0);
            }
            break;
            case 'detail':{
                cc.vv.popMgr.wait('正在查看成员胜点清单',function(){
                    cc.vv.net1.quick("club_pwb_list",{club_id:cc.vv.userMgr.club_id,player_id:self.lblID.string,type:0});
                })
                
            }
            break;
        }
    },

    resetJob:function(job){
        var self = this;
        cc.vv.popMgr.wait('正在修改管理员设置',function(){
            cc.vv.net1.quick("club_user_admin",{club_id:cc.vv.userMgr.club_id,
                user_id:self.lblID.string,is_admin:job});
        })
        
    },

    // update (dt) {},
});
