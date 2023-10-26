cc.Class({
    extends: cc.Component,

    properties: {
        sichuan_room_fangxiang_001:cc.Node,
        sichuan_room_fangxiang_002:cc.Node,
        sichuan_room_fangxiang_003:cc.Node,
        sichuan_room_fangxiang_004:cc.Node,

        texiao1:cc.Node,
        texiao2:cc.Node,
        texiao3:cc.Node,
        texiao4:cc.Node,

        dong:cc.Node,
        nan:cc.Node,
        xi:cc.Node,
        bei:cc.Node,

        tableAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },

        labelLblTime:cc.Label,
    },

    onLoad () {
        //监听协议
        this.initEventHandlers();
    },  

    start () {
      
    },

    initEventHandlers:function(){
        var self = this;

        this.node.on('showLight',function(data){
            self.showLight(data.data);
        });

        this.node.on('hideLight',function(){
            self.hideLight();
        });

        this.node.on('lastLight',function(data){
            self.lastLight(data.data);
        });
        this.node.on('changeNum', function(data){
            self.changeNum(data.data);
        });

        this.node.on('allLight',function(){
            self.allLight();
        });

        this.node.on('setDirection',function(){
            self.setDirection();
        });
    },

    showLight:function(data){
        this.hideLight();
        switch(data.position){
            case "myself":
                this.sichuan_room_fangxiang_001.active = true;
                break;
            case "right":
                this.sichuan_room_fangxiang_004.active = true;
                break;
            case "up":
                this.sichuan_room_fangxiang_003.active = true;
                break;
            case "left":
                this.sichuan_room_fangxiang_002.active = true;
                break;
        }
    },

    lastLight:function(data){
        switch(data.position){
            case "myself":
                var texiao = this.texiao1.getComponent(cc.Animation);
                texiao.play("arrowlight");
                this.sichuan_room_fangxiang_001.getComponent(cc.Animation).play("trun_flash");
                break;
            case "right":
                var texiao = this.texiao4.getComponent(cc.Animation);
                texiao.play("arrowlight");
                this.sichuan_room_fangxiang_004.getComponent(cc.Animation).play("trun_flash");
                break;
            case "up":
                var texiao = this.texiao3.getComponent(cc.Animation);
                texiao.play("arrowlight");
                this.sichuan_room_fangxiang_003.getComponent(cc.Animation).play("trun_flash");
                break;
            case "left":
                var texiao = this.texiao2.getComponent(cc.Animation);
                texiao.play("arrowlight");
                this.sichuan_room_fangxiang_002.getComponent(cc.Animation).play("trun_flash");
                break;
        }
    },

    hideLight:function(){
        this.sichuan_room_fangxiang_001.active = false;
        this.sichuan_room_fangxiang_002.active = false;
        this.sichuan_room_fangxiang_003.active = false;
        this.sichuan_room_fangxiang_004.active = false;
    },

    changeNum:function(data){
        this.labelLblTime.string = data.count;
    },

    allLight:function(){
        this.sichuan_room_fangxiang_001.active = true;
        this.sichuan_room_fangxiang_002.active = true;
        this.sichuan_room_fangxiang_003.active = true;
        this.sichuan_room_fangxiang_004.active = true;
    },

    setDirection:function(){
        var self = this;
        var time = 0;
        if(cc.vv.roomMgr.is_replay){
            time = 1500;
        }
        setTimeout(() => {
            self.node.runAction(cc.sequence(cc.rotateBy(0.5, 360 * 5), cc.callFunc(function(){
                var sides = cc.vv.mahjongMgr._sides;
                for(var i = 0; i < sides.length; ++i){
                    var viewid = cc.vv.roomMgr.viewChairID(i);
                    var sideName = sides[viewid]; 
                    var seatName = sides[i];
                    var spriteFrame = self.nan;
                    switch(sideName){
                        case "right":
                             spriteFrame = self.dong;
                        break;
                        case "up":
                             spriteFrame = self.bei;
                        break;
                        case "left":
                             spriteFrame = self.xi;
                        break;
                    }
                    var altesName = "img_feng_south";
                    switch(seatName){
                        case "right":
                            altesName = "img_feng_east";
                        break;
                        case "up":
                            altesName = "img_feng_north";
                        break;
                        case "left":
                            altesName = "img_feng_west";
                        break;
                    }
                    spriteFrame.getComponent(cc.Sprite).spriteFrame = self.tableAtlas.getSpriteFrame(altesName);
                }
            },self)));
        }, time);
    }
});
