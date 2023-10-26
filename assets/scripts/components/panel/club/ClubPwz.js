cc.Class({
    extends: cc.Component,

    properties: {
        lblLine:cc.Label,
        lblMax:cc.Label,
        lblOther:cc.Label,
        lblReward:cc.Label,
        lblMin:cc.Label,
        lblAA:cc.Label,
        lblFree:cc.Label,
        lblLimit:cc.Label,
        freeRoot:cc.Node,
        maxRoot:cc.Node,
        otherRoot:cc.Node,
        aaRoot:cc.Node,
        bmfToggles:cc.Node,

        _conf:null,
        _line:50,
        _max:0,
        _other:0,
        _reward:0,
        _free:0,
        _min:0,
        _is_mute:1,
        
    },

    onLoad:function(){
        // if(cc.vv.userMgr.guodi > 0){
        //     this.lblLine.string = cc.vv.userMgr.guodi;
        // }
    },

    show:function(conf,is_mute){
        this._is_mute = is_mute;
        this._conf = conf;

        var rules = cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].rules;
        for(var i = 0; i < rules.length; i++){
            if(cc.vv.userMgr.club_rule_id == rules[i].id){
                this.lblLine.string = cc.vv.userMgr.guodi > 0 ? cc.vv.userMgr.guodi : rules[i].line;
                if(conf.name == "nn_1000" || conf.name == "nn_1003"){
                    if(conf.overflow == 1){
                        var bei = 3;
                        if(parseInt(conf.feng) != 0){
                            bei = parseInt(conf.feng);
                        }
                        if(conf.insane == 1){
                            this.lblLine.string = bei*conf.dizhu*9;
                        }else{
                            this.lblLine.string = bei*conf.dizhu*5;
                        }
                        this._minline = parseInt(this.lblLine.string);
                    }
                }else if(conf.name == "ttz_1400"){
                    if(conf.overflow == 1){
                        this.lblLine.string = 12*conf.dizhu;
                        this._minline = parseInt(this.lblLine.string);
                    }
                }else if(conf.name == "ttz_1402"){
                    if(conf.overflow == 1){
                        this.lblLine.string = 9*conf.dizhu;
                        this._minline = parseInt(this.lblLine.string);
                    }
                }
                this.lblMax.string = rules[i].max;
                this.lblMin.string = rules[i].min;
                this.lblOther.string = rules[i].other;
                this.lblReward.string = rules[i].reward;
                this.lblFree.string = rules[i].free;
                this.lblLimit.string = rules[i].max_reward;
                this.lblAA.string = rules[i].bmf;
                this.maxRoot.active = rules[i].is_aa == 0;
                this.otherRoot.active = rules[i].is_aa == 0;
                this.aaRoot.active = rules[i].is_aa == 1;
                this.freeRoot.active = rules[i].is_aa == 0;
                cc.vv.utils.setToggleChecked(this.bmfToggles,this.bmfToggles.children[rules[i].is_aa].name);
                
                return;
            }
        }

        if(cc.vv.userMgr.guodi > 0){
            this.lblLine.string = cc.vv.userMgr.guodi;
        }
        if(conf.name == "nn_1000" || conf.name == "nn_1003"){
            if(conf.overflow == 1){
                var bei = 3;
                if(parseInt(conf.feng) != 0){
                    bei = parseInt(conf.feng);
                }
                if(conf.insane == 1){
                    this.lblLine.string = bei*conf.dizhu*9;
                }else{
                    this.lblLine.string = bei*conf.dizhu*5;
                }
                this._minline = parseInt(this.lblLine.string);
            }
        }else if(conf.name == "ttz_1400"){
            if(conf.overflow == 1){
                this.lblLine.string = 12*conf.dizhu;
                this._minline = parseInt(this.lblLine.string);
            }
        }else if(conf.name == "ttz_1402"){
            if(conf.overflow == 1){
                this.lblLine.string = 9*conf.dizhu;
                this._minline = parseInt(this.lblLine.string);
            }
        }
    },

    //开房
    onBtnSave:function(event,data){

        cc.vv.audioMgr.click();
        var self = this;

        this._line = this.lblLine.string;
        this._max = this.lblMax.string;
        this._other = this.lblOther.string;
        this._reward = this.lblReward.string;
        this._min = this.lblMin.string;
        this._free = this.lblFree.string;
        this._max_reward = this.lblLimit.string;
        this._bmf = this.lblAA.string;
        this._is_aa = cc.vv.utils.toggleChecked(this.bmfToggles) == 'dyj' ? 0 : 1;

        if(this._line < cc.vv.userMgr.guodi){
            cc.vv.popMgr.tip('准入不能低于锅底分' + cc.vv.userMgr.guodi);
            return;
        }
        if(this._minline != null){
            if(parseInt(this._line) < this._minline){
                cc.vv.popMgr.tip('准入不能低于' + this._minline);
                return;
            }
        }
        var club_create_rule_pwz = { // 新建规则
            method:"club_create_rule_pwz",
            data:{
                version:cc.SERVER,
                conf:this._conf,
                info:this._conf.desc,
                club_id:cc.vv.userMgr.club_id,
                id:cc.vv.userMgr.club_rule_id,
                line:this._line,
                max:this._max,
                other:this._other,
                reward:this._reward,
                free:this._free,
                min:this._min,
                max_reward:this._max_reward,
                bmf:this._bmf,
                is_aa:this._is_aa,
                is_mute: this._is_mute,
                index:0,
                default:0,
            }
        };
        cc.vv.popMgr.pop("club/ClucRuleNameEdit",function(obj){
            obj.getComponent("ClucRuleNameEdit").show(club_create_rule_pwz);
        });
        // cc.vv.popMgr.wait("正在保存规则",function(){    
            
        //     cc.vv.net1.send(club_create_rule_pwz);

        //     //设置默认
        //     //cc.vv.net1.quick("club_create_rule_pwz_def",{club_id:cc.vv.userMgr.club_id,index:cc.vv.userMgr.club_rule_id});
        //     self.node.destroy();
        //  });
         self.node.destroy();
    },

    onBtnClicked:function(event){
        cc.vv.audioMgr.click();
        var limit = 10000;
        var label = null;
        if(event.target.parent.name == "lineRoot"){
            label = this.lblLine;
        }
        else if(event.target.parent.name == "maxRoot"){
            label = this.lblMax;
        }
        else if(event.target.parent.name == "otherRoot"){
            label = this.lblOther;
        }
        else if(event.target.parent.name == "rewardRoot"){
            label = this.lblReward;
        }
        else if(event.target.parent.name == "minRoot"){
            label = this.lblMin;
        }
        else if(event.target.parent.name == "AA"){
            label = this.lblAA;
        }
        else if(event.target.parent.name == "limit"){
            label = this.lblLimit;
        }
        else if(event.target.parent.name == "freeRoot"){
            label = this.lblFree;
        }
        switch(event.target.name){
            case "btn_plus100":{
                var num = (parseFloat(label.string) - 100).toFixed(1);
                if(num < 0){
                    num = 0.0;
                }
                label.string = num;
            }
            break;
            case "btn_plus50":{
                var num = (parseFloat(label.string) - 50).toFixed(1);
                if(num < 0){
                    num = 0.0;
                }
                label.string = num;
            }
            break;
            case "btn_add50":{
                var num = (parseFloat(label.string) + 50).toFixed(1);
                label.string = num > limit ? limit : num;
            }
            break;
            case "btn_add100":{
                var num = (parseFloat(label.string) + 100).toFixed(1);
                label.string = num > limit ? limit : num;
            }
            break;
            case "box":{
                cc.vv.popMgr.pop("club/ClubInputPwz",function(obj){
                    obj.getComponent("ClubInputPwz").info(label,limit);
                });
            }
            break;
            case "btn_plus20":{
                var num = (parseFloat(label.string) - 20).toFixed(1);
                if(num < 0){
                    num = 0.0;
                }
                label.string = num;
            }
            break;
            case "btn_add20":{
                var num = (parseFloat(label.string) + 20).toFixed(1);
                label.string = num > limit ? limit : num;
            }
            break;
            case "btn_plus10":{
                var num = (parseFloat(label.string) - 10).toFixed(1);
                if(num < 0){
                    num = 0.0;
                }
                label.string = num;
            }
            break;
            case "btn_add10":{
                var num = (parseFloat(label.string) + 10).toFixed(1);
                label.string = num > limit ? limit : num;
            }
            break;
        }
    },

    onChecked:function(event){
        switch(event.target.name){
            case 'dyj':{
                this.aaRoot.active = false;
                this.maxRoot.active = true;
                this.otherRoot.active = true;
                this.freeRoot.active = true;
            }
            break;
            case 'aa':{
                this.aaRoot.active = true;
                this.maxRoot.active = false;
                this.otherRoot.active = false;
                this.freeRoot.active = false;
            }
            break;
        }
    },

    onDestroy:function(){
        cc.vv.userMgr.guodi = 0;
    }

    // update (dt) {},
});
