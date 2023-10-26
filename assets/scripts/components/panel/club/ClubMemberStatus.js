cc.Class({
    extends: cc.Component,

    properties: {
       head:cc.Node,
       username:cc.Label,
       userid:cc.Label,
       status:cc.Label,
       pwb:cc.Label,
       itemID:0,
    },
    updateID(id){
        this.itemID = id;
    },
    onLoad:function(){
        if(cc.winSize.width / cc.winSize.height - 16 / 9 > 0.1){ 
            var width = cc.winSize.width;
            this.node.width = width;
        }
        // var self = this;
        // this.node.on('new',function(ret){
        //     var data = ret;
        //     self.head.getComponent('ImageLoader').loadImg(data.headimg);
        //     self.username.string = data.name;
        //     self.userid.string = "ID: " + data.userid;
        //     self.pwb.string = "胜点: " + cc.vv.utils.numFormat(data.pwb);
        //     self.getStatus(data);
        // });
    },
    init(data){
        var self = this;
        self.head.getComponent('ImageLoader').loadImg(data.headimg);
        self.username.string = data.name;
        self.userid.string = "ID: " + data.userid;
        self.pwb.string = "胜点: " + cc.vv.utils.numFormat(data.pwb);
        self.getStatus(data);
        // self.node.opacity = 0
    },
    getStatus:function(data){
        var content = '';
        var color = new cc.Color(68, 31, 2);
        switch(data.status){
            case 0:{
                content = '游戏中';
                color = new cc.Color(0, 0, 123);
            }
            break;
            case 1:{
                content = '空闲';
                color = new cc.Color(0, 123, 0)
            }
            break;
            case 3:{
                content = '上次登录时间:' + data.last_login_time;
                color = new cc.Color(123, 0, 0)
            }
            break;
            case 2:{
                content = '离线';
            }
            break;
        }
        this.status.string = content;
        this.status.node.color = color;
    },

    onBtnClicked:function(event){
        
    }

    
});
