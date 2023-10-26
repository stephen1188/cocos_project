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
        text:cc.Label,
    },
    onLoad () {
        this.max = 10000;
    },

    info:function(userid,pwb,pwbnum,type){
        this.userid = userid;
        this.pwb = parseFloat(cc.vv.utils.numFormat(pwb));
        this.pwbnum = pwbnum;
        this.type = type;
        this.text.string = this.pwbnum.string + "";
    },

    judge_pwb:function(){
        // if (this._output.substr(0 , 1) == "-"){
        //     var minpwb = this._output.substr(1,this._output.length);
        //     if(minpwb > this.pwb){
        //         this._output = "-" + this.pwb;
        //     }
        // }
        var num = parseFloat(this.text.string);
        if(this.pwb == 0){
            if(num <= 0){
                num = 0;
            }
        }
        else if(this.pwb > 0){
            if(num + this.pwb < 0){
                num = 0 - this.pwb;
            }
            else if(num > this.max){
                num = this.max;
            }
        }
        else if(this.pwb < 0){
            if(num + this.pwb < 0 && num < 0){
                num = 0;
            }
        }
        this.pwbnum.string = num + "";
    },

    onBtnClicked:function(event,data){
        cc.vv.audioMgr.click();
        switch(event.target.name){
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
            case "0":{
                if(this.text.string == "0" || this.text.string == "0.0"){
                    this.text.string = data;
                    return;
                }
                if(this.text.string.indexOf(".") != -1){
                    var num = this.text.string.split('.');
                    if(num[1].length == 0 && num[0].length < 5 && parseFloat(this.text.string) >= 0){
                        this.text.string += data;
                    }
                    else if(num[1].length == 0 && num[0].length < 6 && parseFloat(this.text.string) < 0){
                        this.text.string += data;
                    }
                }
                else{
                    if(this.text.string.length < 4 && parseFloat(this.text.string) >= 0){
                        this.text.string += data;
                    }
                    else if(this.text.string.length < 5 && parseFloat(this.text.string) < 0){
                        this.text.string += data;
                    }
                }
            }
            break;
            case 'num_+-':{
                var num = parseFloat(this.text.string);
                if(num > 0){
                    this.text.string = '-' + this.text.string;
                }else if(num < 0){
                    this.text.string = this.text.string.substr(1,this.text.string.length - 1);
                }
            }   
            break;
            case 'num_del':{
                if(this.text.string.length > 0){
                    if(this.text.string.length == 1){
                        this.text.string = "0";
                        return;
                    }
                    this.text.string = this.text.string.substr(0,this.text.string.length - 1);
                }
            }
            break;
            case 'btn_ok':{
                if(this.text.string == '-'){
                    this.text.string = "0";
                    cc.vv.popMgr.tip('请输入数字');
                    return;
                }
                this.judge_pwb();
                this.node.destroy();
            }
            break;
            case 'point':{
                if(this.text.string.length > 0){
                    if(this.text.string.indexOf(".") == -1 && this.text.string != "-"){
                        if(this.text.string.length < 5 && parseFloat(this.text.string) >= 0){
                            this.text.string += ".";
                        }
                        else if(this.text.string.length < 6 && parseFloat(this.text.string) < 0){
                            this.text.string += ".";
                        }
                        
                    }
                }
            }
            break;
        }
    },
    // update (dt) {},
});
