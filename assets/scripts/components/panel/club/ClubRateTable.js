
cc.Class({
    extends: cc.Component,

    properties: {
        rateSlider:cc.Slider,
        rate:cc.Label,
        list:cc.Node,
        handle:cc.Button,
        _job:0
    },

    onLoad:function(){
        
    },

    show:function(rate,userid,isallset){
        this.isallset = isallset
        this._userid = userid;
        this.rateSlider.progress = parseFloat(rate);
        this.rateSlider.node.getChildByName("setbl_t").width = 510*parseFloat
        this._oldrate = rate
        this._old = Math.floor(this.rateSlider.progress*10)/10;
        this.sliderChanged(this.rateSlider);
        this._job = cc.vv.userMgr.clublist[cc.vv.userMgr.club_id].job;
        if(this._job != 9){
            // this.handle.interactable = false;
            // this.rateSlider.enabled = false;
        }
    },

    sliderChanged:function(event){
        // this.rate.node.x = event.node.getChildByName('Handle').x;
       
        var value = (Math.floor(event.progress*100)/100).toFixed(2);
        this.rateSlider.node.getChildByName("setbl_t").width = 510*value
        this.rate.string = (value * 100).toFixed(0) + '%';
        for(var i = 0; i < this.list.childrenCount; i++){
            var node = this.list.children[i];
            var fen = parseFloat(node.children[0].name);
            var rate = node.getChildByName('rate');
            var label = rate.getComponent(cc.Label);
            if(fen > 10){
                label.string = this.rate.string;
            }else{
                var total = value*fen*10;
                label.string = Math.round(total.toFixed(1))/10 + '分';
            }
        }
    },

    onBtnClicked:function(event){
        var self = this;
        switch(event.target.name){
            case 'btn_ok':{
                var rate = (Math.floor(this.rateSlider.progress*100)/100).toFixed(2);
                
                // if(parseFloat(rate)>0.9){
                //     cc.vv.popMgr.tip("设置失败，最高不超过90%");
                //     this.rate.string = (this._oldrate * 100).toFixed(0) + '%';
                //     this.rateSlider.progress = parseFloat(this._oldrate);
                //     return;
                // }
                if(this._job == 9){
                    //全部玩家设置 和 单个玩家设置比例 
                    if(this.isallset){
                        cc.vv.net1.quick("club_rate_edit",{club_id:cc.vv.userMgr.club_id,rate:rate});
                    }else{
                        //圈主可以修改打赏分
                        if(this._old != rate){
                            cc.vv.net1.quick("update_club_user_master",{club_id:cc.vv.userMgr.club_id,
                                player_id:this._userid,rate:rate,is_master:1});
                        }
                    }
                }else{
                    
                    if(cc.vv.club._clubPwb){
                        cc.vv.club._clubPwb.active = false
                    }
                    cc.vv.net1.quick("modify_junior_rate",{club_id:cc.vv.userMgr.club_id,player_id:this._userid,rate:rate});
                }
                this.node.destroy();//cc.EditBox
            }
            break;
        }
    }
});
