// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
      textOpinion:cc.EditBox,
      textWxCode:cc.EditBox,
    },
    //点击发送后向服务器发送反馈消息
    onSendFeedback:function()
    {
        cc.vv.audioMgr.click();
        var opinion=this.textOpinion.string;
        var wxcode=this.textWxCode.string;
        if(opinion == "" || wxcode == ''){
            cc.vv.popMgr.tip("信息输入不完整");
            return;
        }
        if(cc.vv.utils.isEmojiCharacter(opinion) || cc.vv.utils.isEmojiCharacter(wxcode)){
            this.textOpinion.string = '';
            this.textWxCode.string = '';
            cc.vv.popMgr.tip("信息不能包含特殊字符");
            return;
        }
        cc.vv.net1.quick("feedback",{info:opinion,wxid:wxcode});
        //this.node.destroy();
    },
    // update (dt) {},
}); 
