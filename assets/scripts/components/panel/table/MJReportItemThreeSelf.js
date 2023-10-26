cc.Class({
    extends: cc.Component,

    properties: {
        nodeDayingjia:cc.Node,
        nodeTuHao:cc.Node,
        nodeZhuang:cc.Node,
        lblName:cc.Label,
        lblId:cc.Label,
        spriteFlg:cc.Sprite,
        spriteFlgbg:cc.Sprite,
        spriteHeadimg:cc.Sprite,
        lblScore:cc.Label,
        lblWinCount:cc.Label,
        lblLoseCount:cc.Label,
        lblCradMaxType:cc.Label,
        winFont:{
            default:null,
            type:cc.Font,
        },
        lostFont:{
            default:null,
            type:cc.Font,
        },
        reportAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
    },

    onLoad:function(){
        this.initEventHandlers();
    },
    //监听协议
    initEventHandlers:function(){
        
        var self = this;
        
        //开始游戏
        this.node.on('info',function(data){
            self.nodeDayingjia.active = data.dayingjia;
            // self.nodeTuHao.active = data.tuhao;
            self.nodeZhuang.active = data.userid == cc.vv.mahjongMgr._zhuang;
            self.lblName.string = data.name;
            self.lblId.string = "ID:" + data.userid;
            self.lblWinCount.string = data.win_count + "局";
            self.lblLoseCount.string = data.lose_count + "局";
            self.lblCradMaxType.string = data.crad_maxtype;
          
            //更新头像
            self.spriteHeadimg.getComponent("ImageLoader").loadImg(data.headimg);

            if(data.score > 0){
                self.lblScore.font = self.winFont;
                self.lblScore.string = "+" + data.score;
                self.spriteFlg.spriteFrame = self.reportAtlas.getSpriteFrame("isheng_0");
                self.spriteFlgbg.spriteFrame = self.reportAtlas.getSpriteFrame("ishengeff_0");
            }else if(data.score < 0){
                self.lblScore.font = self.lostFont;
                self.lblScore.string = data.score;
                self.spriteFlg.spriteFrame = self.reportAtlas.getSpriteFrame("isheng_1");
                self.spriteFlgbg.spriteFrame = self.reportAtlas.getSpriteFrame("ishengeff_1");
            }else{
                self.lblScore.font = self.winFont; 
                self.lblScore.string = data.score;
                self.spriteFlg.spriteFrame = self.reportAtlas.getSpriteFrame("isheng_0");
                self.spriteFlgbg.spriteFrame = self.reportAtlas.getSpriteFrame("ishengeff_0");
            }
        });
    },
});
