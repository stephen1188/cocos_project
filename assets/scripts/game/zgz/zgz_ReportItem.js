cc.Class({
    extends: cc.Component,

    properties: {
        nodeDayingjia:cc.Node,
        nodeDatuhao:cc.Node,
        lblName:cc.Label,
        lblId:cc.Label,
        spriteFlg:cc.Sprite,
        spriteHeadimg:cc.Sprite,
        lblScore:cc.Label,
        checkmark:cc.Node,
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

    fonty:function(){
        this.node.getChildByName("score").y = this.node.getChildByName("score").y  + 10;
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
            self.nodeDatuhao.active = data.datuhao;
            self.checkmark.active = data.userid == cc.vv.userMgr.userid ;
            self.lblName.string = data.name;
            self.lblId.string = "ID:" + data.userid;

            //更新头像
            self.spriteHeadimg.getComponent("ImageLoader").loadImg(data.headimg);

            if(data.score > 0){
                self.lblScore.font = self.winFont;
                self.lblScore.string = "+" + data.score;
                self.spriteFlg.spriteFrame = self.reportAtlas.getSpriteFrame("img_win");
                self.fonty();
            }else if(data.score < 0){
                self.lblScore.font = self.lostFont;
                self.lblScore.string = data.score;
                self.spriteFlg.spriteFrame = self.reportAtlas.getSpriteFrame("img_lose");
            }else{
                self.lblScore.font = self.winFont;
                self.lblScore.string = data.score;
                self.spriteFlg.spriteFrame = self.reportAtlas.getSpriteFrame("img_win");
            }
        });
    },
});
