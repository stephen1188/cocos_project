cc.Class({
    extends: cc.Component,

    properties: {
        nodeShaizi1:cc.Node,
        nodeShaizi2:cc.Node,
        shaiziAnimation:cc.Node,

        shaiziAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
    },

    onLoad () {
        this.shaiziSprite1 = this.nodeShaizi1.getComponent(cc.Sprite);
        this.shaiziSprite2 = this.nodeShaizi2.getComponent(cc.Sprite);
        this.animation = this.shaiziAnimation.getComponent(cc.Animation);
    },

    start () {
        var self = this;
        this.animation.on("finished", function(){
            self.nodeShaizi1.active = true;
            self.nodeShaizi2.active = true;
            self.shaiziAnimation.active = false;
        });

        //监听事件
        this.initEventHandlers();
    },

    initEventHandlers:function(){
        var self = this;
        //游戏同步
        this.node.on('yaoshaizi',function(data){
            data = data.data;
            self.node.active = true;
            self.shaiziAnimation.active = true;
            self.nodeShaizi1.active = false;
            self.nodeShaizi2.active = false;
            var num1 = data.num1;
            var num2 = data.num2;
            self.shaiziSprite1.spriteFrame = self.shaiziAtlas.getSpriteFrame("sezi_value" + num1);
            self.shaiziSprite2.spriteFrame = self.shaiziAtlas.getSpriteFrame("sezi_value" + num2);
            self.animation.play("shaizi");
        });

        this.node.on('hideshaizi',function(){
            self.shaiziAnimation.active = false;
            self.nodeShaizi1.active = false;
            self.nodeShaizi2.active = false;
        });
    }
});
