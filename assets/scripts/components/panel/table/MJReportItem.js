cc.Class({
    extends: cc.Component,

    properties: {
        nodeDayingjia:cc.Node,
        nodeTuHao:cc.Node,
        nodeZhuang:cc.Node,
        lblName:cc.Label,
        lblId:cc.Label,
        spriteFlg:cc.Sprite,
        spriteHeadimg:cc.Sprite,
        lblScore:cc.Label,
        checkmark:cc.Node,
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
            self.checkmark.active =data.userid == cc.vv.userMgr.userid;
            self.nodeTuHao.active = data.tuhao;
            //提示地址相同 处理一下昵称截断 防止广告
            self.lblName.string = cc.vv.utils.cutString(data.name,6);
            self.lblId.string = "ID:" + data.userid;
            self.lblWinCount.string = "赢:"+data.win_count;
            self.lblLoseCount.string = "输:"+data.lose_count;
            self.lblCradMaxType.string = "最大牌:"+data.crad_maxtype;
            if(self.nodeZhuang){
                self.nodeZhuang.active = data.userid == cc.vv.mahjongMgr._zhuang;
            }
            //更新头像
            self.spriteHeadimg.getComponent("ImageLoader").loadImg(data.headimg);

            if(data.score > 0){
                self.lblScore.font = self.winFont;
                self.lblScore.string = "+" + data.score;
                self.spriteFlg.spriteFrame = self.reportAtlas.getSpriteFrame("img_win");
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
