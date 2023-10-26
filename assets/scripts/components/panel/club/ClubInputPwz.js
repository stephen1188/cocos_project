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
        text:cc.Label
    },
    onLoad () {

    },

    info:function(pwbnum,limit){
        this.limit = limit;
        this.pwbnum = pwbnum;
        this.text.string = pwbnum.string.toString();
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
                if(this.text.string.length > 0){
                    if(parseFloat(this.text.string) > this.limit){
                        this.text.string = this.limit;
                    }
                    this.pwbnum.string = parseFloat(this.text.string).toString();
                    this.node.destroy();
                }
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
            default:{
                cc.vv.popMgr.tip("敬请期待");
            }
        }
    },
    // update (dt) {},
});
