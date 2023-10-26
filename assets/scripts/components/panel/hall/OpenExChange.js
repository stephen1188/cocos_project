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
        _select_index:1,
        _send_iphone:"",
        _pre_score:50000,
    },


    // onLoad () {},

    start () {
        this.init();
    },
    init:function(){
        this._select_index = 1;
        this._pre_score = 50000;
    },
    showInfo:function(){
    
        var sendinfo =  this.node.getChildByName("sendinfo");
        sendinfo.active = true;
        var name = sendinfo.getChildByName("name").getComponent(cc.Label);
        sendinfo.getChildByName("score").getComponent(cc.Label).string = "";
        if(this._select_index == 1){
            name.string="话费充值";
            this._pre_score = 10000
        }else if(this._select_index == 2){
            name.string="话费充值";
            this._pre_score = 50000
        }else if(this._select_index == 3){
            name.string="音响";
            this._pre_score = 79000
        }else if(this._select_index == 4){
            name.string="充电宝";
            this._pre_score = 148000
        }else if(this._select_index == 5){
            name.string="剃须刀";
            this._pre_score = 499000
        }else if(this._select_index == 6){
            name.string="iPad air2";
            this._pre_score = 2478000
        }else if(this._select_index == 7){
            name.string="华为P20 Pro";
            this._pre_score = 4988000
        }else if(this._select_index == 8){
            name.string="iPhone X";
            this._pre_score = 8388000
        }
        sendinfo.getChildByName("score").getComponent(cc.Label).string = this._pre_score;
        if(cc.vv.userMgr.coins < this._pre_score){
            cc.vv.popMgr.tip("您的积分不够，不能兑换该奖品。");
            sendinfo.active = false;
            return;
        }
    },
    sendInfo:function(){
        var input_ipone_code = this.node.getChildByName("sendinfo").getChildByName("input_ipone_code").getComponent(cc.EditBox).string;
        if(input_ipone_code == "" || input_ipone_code.length != 11){
            cc.vv.popMgr.tip("手机号输入不正确");
            return;
        }
        cc.vv.popMgr.alert("请核对好您的联系信息方式，如果填写错，奖品可能会发送给人。\n电话号码："+input_ipone_code,function(){
            cc.vv.net1.quick("redeem_record",{redeem_id:this._select_index,mobile:input_ipone_code});
        },true);
        
    },

    onBtnClick:function(event,customEventData){
        switch(event.target.name){
            case "send":{
                if(this._select_index == -1){   
                    cc.vv.popMgr.tip("请选择兑换的物品！");
                }else{
                    this.showInfo();
                }
            }
            break;
            case "ExChange_Courtesy":{
                this._select_index = customEventData;
            }
            break;
            case "btn_info_back":{
                this.node.getChildByName("sendinfo").active = false;
            }
            break;
            case "send_info":{
                this.sendInfo();
              
            }
            break;
            default:{
                cc.vv.popMgr.tip("你点的啥："+event.target.name);
            }
        }
    },
    // update (dt) {},
});
