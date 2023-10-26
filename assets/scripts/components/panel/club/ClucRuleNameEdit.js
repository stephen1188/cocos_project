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
        _club_create_rule:null,
        rulename:cc.EditBox
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    show:function(rule){
        this._club_create_rule = rule;
        var node = cc.vv.club._clubSetRule.getComponent("ClubSetRule").getRule(rule.data.id);
        if(node == null){
            this.rulename.string = "";
        }else{
            this.rulename.string = node.a_name;
            if(node.a_name == null){
                this.rulename.string = "";
            }
        }
    },

    onBtnClicked:function(event){
        var self = this;
        cc.vv.audioMgr.click();
        switch(event.target.name){
            case "btn_save":{
                self._club_create_rule.data.name = this.rulename.string;
                var check_str_name = cc.vv.utils.testBad2('' + this.rulename.string);
              
                if(this.rulename.string == ""){
                    cc.vv.popMgr.tip("规则别名不能为空");
                    return;
                }
                if(check_str_name){
                    cc.vv.popMgr.alert('您输入的内容包括了不合适的关键字');
                    return;
                }
                cc.vv.popMgr.wait("正在保存规则",function(){
                    cc.vv.net1.send(self._club_create_rule);
                    self.node.destroy();
                });
            }
            break;
        }
    }

    // update (dt) {},
});
