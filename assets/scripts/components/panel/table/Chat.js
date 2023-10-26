cc.Class({
    extends: cc.Component,

    properties: {
        quick:cc.Node,
        emoji:cc.Node,
        lists:cc.Node,
        editChat:cc.EditBox,
        quickItem:cc.Prefab,
        emojiItem:cc.Prefab,
        emojiAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
    },

    start(){
        this.initQuickChat();
        this.initEjoji();
    },

    
    //初始化聊天内容
    initQuickChat:function(){
        
        var list = cc.vv.game.config.quick_chat;

        this.quick.removeAllChildren();
        for(var i = 0; i < list.length; ++i){
            var node = cc.instantiate(this.quickItem);
            this.quick.addChild(node);
            node.getComponent("ChatQuickItem").init(list[i].id,list[i].info,this.node);
        }
    },

    //初始化聊天内容
    initEjoji:function(){
        var self = this;
        self.emoji.removeAllChildren();
        for(var i = 0; i < 22; ++i){
            var node = cc.instantiate(self.emojiItem);
            self.emoji.addChild(node);
            node.getComponent("ChatEmojiItem").init(i,self.emojiAtlas.getSpriteFrame("emoji_index_" + i,),self.node);
        }
    },

    onBtnSend:function(){
        return
        var string = this.editChat.string;
        var check_str_name = cc.vv.utils.testBad('' + string);
        if(check_str_name){
            cc.vv.popMgr.alert('您输入的内容包括了不合适的关键字');
            return;
        }
        cc.vv.net2.quick("chat",{content:string});
        this.node.active = false;
    },

    /**
     * 类型选择
     */
    onBtnleiXingXuanZe:function(event,detail){
        cc.vv.audioMgr.click();
        if(detail == null)detail = event.target.parent.name;
        for(var i = 0; i < this.lists.children.length; ++i){
            var name = this.lists.children[i].name;
            this.lists.children[i].active = (detail == name);
        }
    },
});
