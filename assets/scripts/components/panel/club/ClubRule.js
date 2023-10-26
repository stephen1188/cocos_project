    cc.Class({
    extends: cc.Component,

    properties: {
        lblIndex:cc.Label,
        lblRule:cc.Label,
        pwz:cc.Label,
        toggle:cc.Toggle,

        _id:0,
        _default:0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(cc.winSize.width / cc.winSize.height - 16 / 9 > 0.1){ 
            var width = cc.winSize.width;
            this.node.width = width-314;
        }
    },

    initPtz:function(data){
        this.lblRule.string = data.info;
        this._id = data.id;
    },

    initPwz:function(data){
        this.lblRule.string = data.info;
        this.pwz.string = '晋级赛准入:' + data.line + ' ' + '大赢家:' + data.max + ' ' + '其他每人:' + data.other + ' '
                            + '胜点小于' + data.min + '暂停' + ' ' + '大赢家得分低于' + data.free + '免单' + ' ' 
                            + '大赢家得分高于200分额外:' + data.reward;
        this._default = data.default;
        this.toggle.isChecked = data.default == 1;
        //this._id = data.id;
        if(this.lblIndex){
            this.lblIndex.string = this.node.myTag;
        }
    },

    onToggled:function(event){
        var self = this;
        cc.vv.audioMgr.click();
        
        var def = 0;
        if(event.isChecked){
            def = 1;
        }
        cc.vv.popMgr.wait('正在设置默认规则',function(){
            cc.vv.net1.quick("club_create_rule_pwz_def", {id:self.node.id,club_id:cc.vv.userMgr.club_id,default:def});
        })
        
        
    },

    onBtnClicked:function(event){
        var self = this;
        cc.vv.audioMgr.click();
        switch(event.target.name){
            case 'btn_del':{
                cc.vv.popMgr.alert('是否确认删除默认规则' + this.node.myTag + '?',function(){
                    cc.vv.popMgr.wait('正在删除规则' + self.node.myTag,function(){
                        cc.vv.net1.quick("club_delete_rule_pwz", {id:self.node.id,club_id:cc.vv.userMgr.club_id});
                    });
                   
                },true);
            }
            break;
            default:{
                if(this.node.myTag > 0){
                    cc.vv.hall.create_room = 3;
                }
                else{
                    cc.vv.hall.create_room = 2;
                }
                cc.vv.userMgr.club_rule_id = this.node.id;
                cc.vv.popMgr.pop('hall/CreateRoom',function(obj){
                    obj.emit('show');
                });
            }
        }
    },

    // update (dt) {},
});
