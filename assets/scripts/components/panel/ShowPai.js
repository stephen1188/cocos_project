cc.Class({
    extends: cc.Component,

    properties: {
        btn_close:{
            default:null,
            type:cc.Button
        },
        carditem:{
            default:null,
            type:cc.Node
        },
        scrollview:{
            default:null,
            type:cc.Node
        },
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {
        var self = this

    },
    show_card:function(data){
        this.b_x = -513
        this.b_y = -48
        if(parseInt(data.length)>48){this.scrollview.height = this.scrollview.height + 100*(parseInt(data.length/12)-3)}
        for(var i = 1;i<=data.length;i++){
            var item = cc.instantiate(this.carditem);
            var x = parseInt(i%12)
            if (i>0&&x==0){x = 12}
            if(parseInt(i/12)){}
            var y = parseInt(i/12)
            if(parseInt(i%12)==0&&i>0){y = y-1}//如果大于零 且没有余数 默认为最后的那个尾巴。
            item.setPosition(cc.v2(this.b_x + x*80,this.b_y - 100*y))
            item.setTag(data[i-1])
            var altas = cc.vv.game.majiangTable.selfhandAtlasThreeD;
            var altasName = "img_cardvalue";
            var pai = cc.vv.mahjongMgr.getMahjongPai(data[i-1]);
            var ls_sp = item.getChildByName("card_img")
            ls_sp.getComponent(cc.Sprite).spriteFrame = altas.getSpriteFrame(altasName + pai);
            this.scrollview.addChild(item)
        }
    },
    onBtnClicked:function(event){
        cc.vv.audioMgr.click();
        var self = this;
        cc.vv.net2.quick("cheatNextPai",{pai:event.target.myTag});
        this.node.removeFromParent()
    }
    // update (dt) {},
});
