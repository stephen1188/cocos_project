cc.Class({
    extends: cc.Component,

    properties: {
       head:cc.Node,
       username:cc.Label,
       userid:cc.Label,
       count:cc.Label,
       rate:cc.Label,
       itemID:0,
    },

    
    onLoad () {
        if(cc.winSize.width / cc.winSize.height - 16 / 9 > 0.1){ 
            var width = cc.winSize.width;
            this.node.width = width;
        }
    },
    updateID(id){
        this.itemID = id;
    },
    init(data){
        this.head.getComponent('ImageLoader').loadImg(data.headimg);
        this.username.string = data.name;
        this.userid.string = data.user_id;
        if(data.count != null){
            this.count.string = data.count+'人';
        }
        this._rate = data.rate;
        this.rate.string = parseInt(data.rate*100) + "%";  
    },
    countAdd:function(){
        this.count.string = parseInt(this.count.string) + 1;
    },

    onBtnClicked:function(event){
        var self = this;
        switch(event.target.name){
            case 'btn_chakan':{
                cc.vv.popMgr.wait('正在获取列表',function(){
                    cc.vv.net1.quick("club_single_push_list",{club_id:cc.vv.userMgr.club_id,player_id:self.userid.string});
                });
                
            }
            break;
            case 'btn_set':{
               cc.vv.popMgr.pop('club/ClubRateTable',function(obj){
                   obj.getComponent('ClubRateTable').show(self._rate,self.userid.string);
               });
            }
            break;
            case 'btn_bind':{
                cc.vv.popMgr.pop('club/ClubBind',function(obj){
                    obj.getComponent("JoinClub").show(parseInt(self.userid.string));
                });
             }
             break;
        }
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
