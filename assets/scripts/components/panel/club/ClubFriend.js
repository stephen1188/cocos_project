
cc.Class({
    extends: cc.Component,

    properties: {
        head:cc.Node,
        username:cc.Label,
        userid:cc.Label,
        round:cc.Label,
        itemID: 0,
    },

    onLoad () {
        // this.node.on('new',function(ret){
        //     var data = ret;
        //     self.head.getComponent('ImageLoader').loadImg(data.headimg);
        //     self.username.string = data.name;
        //     self.userid.string = data.user_id;
        // });
        this.rate = 0
    },
    updateID(id){
        this.itemID = id;
    },
    init(data){
        // this.node.x = 0
        this.head.getComponent('ImageLoader').loadImg(data.headimg);
        this.username.string = data.name;
        this.userid.string = data.user_id;
        this.node.getChildByName("fnums").getComponent(cc.Label).string = data.fcode+"人"
        this.node.getChildByName("tequan").getComponent(cc.Label).string = parseInt(data.rate*100) + "%";  
        this.rate = data.rate
    },
    BtnCLick:function(){
        var self = this;
        //判断这个号有没有操作权限
        cc.vv.popMgr.pop('club/UserManager',function(obj){
            cc.vv.club._clubPwb = obj;
            obj.getComponent('UserManager').show(self.userid.string,true);   
        });
    },
    onBtn_setRate(){
        let self = this
        cc.vv.popMgr.pop('club/ClubRateTable',function(obj){
            obj.getComponent('ClubRateTable').show(self.rate,self.userid.string,false);
        });
    },
    memberinfo:function(data){
        var self = this;
        var spr = this.head.getComponent(cc.Sprite).spriteFrame;
        if(!cc.vv.club._clubPwb){
            return;
        }
        cc.vv.club._clubPwb.getComponent('UserManager').info({club_id:cc.vv.userMgr.club_id,
            username:data.name,
            userid:data.user_id,
            headimg:spr,job:self._job,
            rate:data.rate,
            pwb:data.pwb,status:data.status,
            limit:self._limit});
    },
    update (dt) {
        let worldPos = this.node.parent.convertToWorldSpaceAR(this.node.position);
        let viewPos = this.node.parent.parent.convertToNodeSpaceAR(worldPos);
        if(viewPos.y>this.node.height/2){
            this.node.opacity =0
        }else if(viewPos.y<-(this.node.parent.parent.height + this.node.height/2 )){
            this.node.opacity =0
        }else{
            this.node.opacity =255
        }
    },
});
