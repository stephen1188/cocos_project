cc.Class({
    extends: cc.Component,

    properties: {
        lblName:cc.Label,
        lblID:cc.Label,
        head:cc.Node,
        friend:cc.Node,
        master_id:cc.Label,
        master_name:cc.Label
    },

    onLoad () {

        if(cc.winSize.width / cc.winSize.height - 16 / 9 > 0.1){ 
            var width = cc.winSize.width;
            this.node.width = width;
        }
    },

    show:function(data){
        this.lblName.string = data.name;
        this.lblID.string = data.userid;
        this.head.getComponent("ImageLoader").loadImg(data.headimg);
        this._masterid = data.master_id;
        if(data.master_id){
            this.friend.active = true;
            this.master_id.string = data.master_id;
            this.master_name.string = data.master_name;
        }
    },

    onBtnClicked:function(event){
        var self = this;
        var masterid = this._masterid ? '_' + this._masterid : "";
        switch(event.target.name){
            case 'btn_agree':{
                cc.vv.net1.quick("club_user_review",{club_id:cc.vv.userMgr.club_id,user_id:""+self.lblID.string + masterid});
                this.node.destroy();
            }
            break;
            case 'btn_disagree':{
                cc.vv.net1.quick("club_user_refused",{club_id:cc.vv.userMgr.club_id,user_id:""+self.lblID.string + masterid});
                this.node.destroy();
            }
            break;
        }
    }

});
